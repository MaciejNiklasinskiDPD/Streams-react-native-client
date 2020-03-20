import NetInfo from "@react-native-community/netinfo";

let unsubscribe = null;
let isConnectedFlag = null;
let tasksOnConnectionReestablished = [];

export default class InternetConnectionServices {

    // Answers the question whether internet connection is currently available.
    static async isConnected() {

        // If not yet subscribed to on network changed event ..
        if (!unsubscribe)
            // .. subscribe to it and await its initial result.
            unsubscribe = await subscribeToOnNetworkChanged();

        // Return the value of the flag.
        return isConnectedFlag;
    }

    // Assigns provided callback, and error callback to be executed whenever 
    // internet connection is reestablished.
    static executeOnConnectionReestablished(onConnectionReestablished = () => { }, onError = () => { }) {
        tasksOnConnectionReestablished.push(async () => {
            try {
                await onConnectionReestablished();
            } catch (error) {
                await onError(error);
            }
        });
    }
}

// Subscribe to on network changed event
function subscribeToOnNetworkChanged() {
    return new Promise((resolve) => {
        // Adds on network state changed event listener.
        const unsubscribe = NetInfo.addEventListener((state) => {
            // Store current value of the flag as function scope variable.
            const previousFlag = isConnectedFlag;

            // If any of necessary values is still unknown return without resolving the promise.
            if (state.isConnected === null || state.isInternetReachable === null)
                return;
            // If both isConnected and isInternet reachable fields of the state are true ..
            else if (state.isConnected && state.isInternetReachable)
                // .. set value of isConnectedFlag to true ..
                isConnectedFlag = true;
            else
                // .. otherwise set it to false.
                isConnectedFlag = false;

            // Resolve initial state promise.
            resolve(unsubscribe);

            // If internet connection has been reestablished ..
            if (previousFlag === false && isConnectedFlag === true)
                // .. handle it appropriately, executing all tasks 
                // assigned to be executed on connection reestablished.
                handleConnectionReestablished();
        });
    });
}

async function handleConnectionReestablished() {
    // Stores references to all already added tasks within function scope variable ..
    const currentTasksOnConnectionReestablished = tasksOnConnectionReestablished;
    // .. and replace module scope tasks array with new, empty one.
    tasksOnConnectionReestablished = [];

    const executedTasks = [];
    let executionInterrupted = false;

    // For each task added for execution when in internet connection will be reestablished.
    for (i = 0; i < currentTasksOnConnectionReestablished.length; i++) {
        // Execute task ..
        const task = currentTasksOnConnectionReestablished[i];
        await task();
        // .. and add it to array of already executed tasks.
        executedTasks.push(task);

        // Ensure that internet connection hasn't been lost during execution of the task ..
        const { isConnected, isInternetReachable } = await NetInfo.fetch();
        // .. and if it has been lost ..
        if (!isConnected || !isInternetReachable) {
            // .. mark execution as interrupted ..
            executionInterrupted = false;
            // .. and break out from the loop.
            break;
        }
    }

    // If execution has been interrupted...
    if (!executionInterrupted) {
        // .. get tasks which haven't managed to be executed ..
        const unexecutedTasks = currentTasksOnConnectionReestablished.filter((task) => {
            return !executedTasks.includes(task);
        });

        // .. and push them into existing module scope tasksOnConnectionReestablished array.
        unexecutedTasks.forEach((unexecutedTask) => {
            tasksOnConnectionReestablished.push(unexecutedTask);
        });
    }
    // Else if any new tasks been added during execution of existing tasks ..
    else if (tasksOnConnectionReestablished.length > 0)
        // .. handle newly added tasks as well.
        await handleConnectionReestablished();
}