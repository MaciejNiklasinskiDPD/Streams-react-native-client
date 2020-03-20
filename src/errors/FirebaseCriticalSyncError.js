export default class FirebaseCriticalSyncError extends Error {
    constructor(message, syncError, firebaseTerminationError, callbacksErrors = []) {
        if (!message)
            message = "Firebase critical sync error. The data committed when offline cannot be properly sync with the cloud instance of firestore.";

        if (!message && firebaseTerminationError)
            message += ` An error also occurred during attempt to safely disposed invalid firebase instance. See error details:\n\n${firebaseTerminationError}`;
        else if (!message && callbacksErrors.length > 0)
            for (let i = 0; i < callbacksErrors.length; i++)
                message += `\n\nSee also callback error details:\n\n${callbacksErrors[i]}`;
        else if (!message && syncError)
            message += ` See error details:\n\n${syncError}`;

        super(message);

        this.syncError = syncError;
        this.firebaseTerminationError = firebaseTerminationError;
        this.callbacksErrors = callbacksErrors;
    }
}