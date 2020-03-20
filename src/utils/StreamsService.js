import FirebaseServices from './FirebaseServices';
import RandomValuesProvider from './RandomValuesProvider';

let streamsSubscription = null;

export default class StreamsService {
    // Persist new stream within the database.
    static async createStream(stream) {
        // Generate new random stream id and assign its value to the stream object.
        stream.id = await RandomValuesProvider.getString(20);

        // Create new firestore document within the streams collection 
        // using stream id as a document id, and persist the stream object within it.
        await FirebaseServices.createDocument('streams', stream.id, stream);
    }

    // Subscribes for an real time updates within streams collection.
    static subscribeToStreams(onCollectionChanged = () => { }, onError = () => { }) {
        if (streamsSubscription)
            throw new Error('Already subscribed for streams real time data update.');

        streamsSubscription = FirebaseServices.subscribeToCollectionData('streams', onCollectionChanged, onError);
        FirebaseServices.addOnFirebaseFailure(StreamsService.unsubscribeFromStreams);
    }

    // Unsubscribes from real time updates for streams collection.
    static unsubscribeFromStreams() {
        if (!streamsSubscription)
            throw new Error('There is currently no active streams real time data update subscriptions.');

        streamsSubscription();
        streamsSubscription = null;
    }

    // Returns all existing streams object from the streams firestore collection.
    static getStreams() {
        return FirebaseServices.getCollectionData('streams');
    }

    // Returns a stream object associated with the provided id component.
    static getStream(id) {
        return FirebaseServices.getDocumentData('streams', id);
    }

    // Updates existing stream document according the provided streamUpdate object.
    static async updateStream(id, streamUpdate) {
        // Persist update to the stream within the appropriate firestore document.
        await FirebaseServices.updateDocument('streams', id, streamUpdate);
    }

    // Removes the stream from the database.
    static async deleteStream(id) {
        // Removes the stream document associated with the provided id.
        await FirebaseServices.delateDocument('streams', id);
    }
}