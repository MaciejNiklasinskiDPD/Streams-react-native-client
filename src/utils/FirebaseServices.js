import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

import RandomValuesProvider from './RandomValuesProvider';
import ObjectEqualityComparer from './ObjectEqualityComparer';

import FirebaseAuthorizationError from '../errors/FirebaseAuthorizationError';
import AccountExistsWithDifferentCredentialError from '../errors/AccountExistsWithDifferentCredentialError';
import FirebaseCriticalSyncError from '../errors/FirebaseCriticalSyncError';

// Firebase config
const config = require('../../firebaseConfig.json');

let firebaseApp = null;
let handleFirebaseCriticalSyncError;
let firestore = null;

let isInitialized = false;
let isSignedIn = null;
let currentUserUID = null;

// Flag indicating whether firebase critical sync error has been handle.
let firebaseFailureHandled = true;

// Array of functions to be performed right before handling firebase critical sync error.
let onFirebaseFailedCallbacks = [];

// Google credentials factory.
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Facebook credentials factory.
const facebookProvider = new firebase.auth.FacebookAuthProvider();

export default class FirebaseServices {

    // Initialize the firebase service.
    static initialize(handleFirebaseCriticalSyncErrorCallback = () => { }) {
        if (isInitialized)
            throw new Error('Firebase service is already initialized.');

        firebaseFailureHandled = false;
        onFirebaseFailedCallbacks = [];
        handleFirebaseCriticalSyncError = handleFirebaseCriticalSyncErrorCallback;

        return new Promise(async (resolve, reject) => {
            try {
                // Initialize firebase.
                firebaseApp = firebase.initializeApp(config);

                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        isSignedIn = true;
                        currentUserUID = user.uid;
                    }
                    else
                        isSignedIn = false;

                    isInitialized = true;

                    resolve(currentUserUID);
                });

                // Initialize firestore
                firestore = firebase.firestore();
            }
            catch (error) {
                reject(error);
            }
        });

    }

    // Signs in user to firebase using provided google idToken.
    static async signInWithGoogle(idToken) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        try {
            // Construct an instance of credentials.
            const credentials = googleProvider.credential(idToken);

            // Sign in to firebase using created credentials.
            const result = await firebase.auth().signInWithCredential(credentials);

            // Return signed user UID.
            return result.user.uid;
        }
        catch (error) {
            throw new FirebaseAuthorizationError(`Unable to sign in to firebase. See inner error details: \n${error}`, error);
        }
    }

    // Signs in user to firebase using provided facebook access token.
    static async signInWithFacebook(accessToken) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        try {
            // Construct an instance of credentials.
            const credentials = facebookProvider.credential(null, accessToken);

            // Sign in to firebase using created credentials.
            const result = await firebase.auth().signInWithCredential(credentials);

            // Return signed user UID.
            return result.user.uid;
        }
        catch (error) {
            if (error.code === "auth/account-exists-with-different-credential")
                throw new AccountExistsWithDifferentCredentialError();

            throw new FirebaseAuthorizationError(`Unable to sign in to firebase. See inner error details: \n${error}`, error);
        }
    }

    // Sign out from firebase.
    static signOut() {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return firebase.auth().signOut();
    }

    // Answers the question whether user is signed in to firebase.
    static isSignedIn() {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return isSignedIn;
    }

    // Answers the question whether document associated with provided collectionId and documentId exists.
    static async isDocumentExists(collectionId, documentId) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        const document = await FirebaseServices.getDocument(collectionId, documentId);
        return document.exists;
    }

    // Create
    static createDocument(collectionId, documentId, data) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        // Define necessary variables outside of the scope of promise and all callbacks to make them accessible from the scope of each callback and the promise.
        let unsubscribe, resolve, reject;
        // Declare create document promise completion state flag. 
        // This will be later used to determinate how to correctly throw firestore synchronization error if needed.
        let completionState = 'pending';
        // Declare counter variable, which will store the value of how many times create document data validation function
        // has been triggered by real time data updates subscription to the updated document.
        let counter = 0;

        // Assign created document data validation function.
        const confirmValidityOfDocumentCreation = (documentData) => {
            // Increase value of the counter by one.
            counter++;

            // Perform deep comparison of the data provided for document creation and document data
            // reported to be inserted into firestore by firestore itself, and if established equality ..
            if (ObjectEqualityComparer.deepCompare(data, documentData)) {

                // .. unsubscribe from real time document updates to not be executed ever again ..
                unsubscribe();

                // .. resolve pending document creation promise. 
                resolve();
            }
            // Otherwise if counter is equal one and expected data is not what was expected to be,
            // return without failure. This will allow to override existing document with matching documentId,
            // which is default firestore behavior.
            else if (counter === 1) return;
            // Otherwise if established no equality ..
            else {
                // .. unsubscribe from real time document updates to not be executed ever again ..
                unsubscribe();
                // .. serialize both data reported to be inserted by firestore and data provided for document creation ..
                const { dataJSON, documentDataJSON } = safeDataComparisonStringify(data, documentData);
                // .. then use that serialized data to construct appropriate error, and reject the pending document creation promise
                // providing that error as a rejection parameter.
                reject(new Error(`Unexpected data inserted to document. Expected:\n\n${dataJSON}\n\nbut instead stored:\n\n${documentDataJSON}`));
            }
        };


        // // Assign created document data validation function.
        // const confirmValidityOfDocumentCreation = (documentData) => {

        //     // Unsubscribe from real time document updates to not be executed ever again.
        //     unsubscribe();

        //     // Perform deep comparison of the data provided for document creation and document data
        //     // reported to be inserted into firestore by firestore itself, and if established equality ..
        //     if (ObjectEqualityComparer.deepCompare(data, documentData))
        //         // .. resolve pending document creation promise. 
        //         resolve();
        //     // Otherwise if established no equality ..
        //     else {
        //         // .. serialize both data reported to be inserted by firestore and data provided for document creation ..
        //         const { dataJSON, documentDataJSON } = safeDataComparisonStringify(data, documentData);
        //         // .. then use that serialized data to construct appropriate error, and reject the pending document creation promise
        //         // providing that error as a rejection parameter.
        //         reject(new Error(`Unexpected data inserted to document. Expected:\n\n${dataJSON}\n\nbut instead stored:\n\n${documentDataJSON}`));
        //     }
        // };


        // Assign handle document creation error function.
        const handleErrorOnDocumentCreation = (error) => {

            // Unsubscribe from real time document updates to not be executed ever again.
            unsubscribe();

            // Reject the pending document creation promise passing error parameter as a rejection parameter.
            reject(error);
        };

        // Return new document creation promise.
        return new Promise(async (resolvePromise, rejectPromise) => {

            // Assign custom promise resolve function which will change function scope variable completionSate
            // appropriately whenever promise will get resolve.
            resolve = (arg) => {
                completionState = 'resolved';
                resolvePromise(arg);
            }

            // Assign custom promise reject function which will change function scope variable completionSate
            // appropriately whenever promise will get rejected.
            reject = (arg) => {
                completionState = 'rejected';
                rejectPromise(arg);
            }

            // Subscribe to real time document data updates with created document validation function, and error handling function.
            unsubscribe = FirebaseServices.subscribeToDocumentData(collectionId, documentId,
                confirmValidityOfDocumentCreation, handleErrorOnDocumentCreation);

            try {
                // If no documentId has been provided generate random string of 20 characters.
                if (!documentId) documentId = await RandomValuesProvider.getString(20);

                // Create document within the firestore.
                await firestore.collection(collectionId).doc(documentId).set(data);

                // If promise has not been yet resolved by created document validation function, resolve it.
                if (completionState === 'pending') resolve();
            } catch (error) {
                // If promise has not been yet resolved by created document validation function,
                // and rejecting promise is still an option, reject it using the caught error as 
                // a rejection parameter.
                if (completionState === 'pending')
                    reject(error);
                // Otherwise if promise already resolved throw the caught error as a firebase critical sync error.                
                else if (completionState === 'resolved')
                    onFirebaseCriticalSyncError(error);
            } finally {
                // Finally unsubscribe from real time document data updates.
                unsubscribe();
            }
        });
    }

    // Read - real time updates
    static subscribeToCollection(collectionId, onCollectionChanged = () => { }, onError = () => { }) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return FirebaseServices.getCollectionReference(collectionId)
            .onSnapshot((collection) => {
                onCollectionChanged(collection);
            }, onError);
    }

    static subscribeToCollectionData(collectionId, onCollectionChanged = () => { }, onError = () => { }) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return FirebaseServices.subscribeToCollection(collectionId, (collection) => {
            const collectionData = collection.docs.map((document) => {
                return document.data();
            });
            onCollectionChanged(collectionData);
        }, onError);
    }

    static subscribeToDocument(collectionId, documentId, onDocumentChanged = () => { }, onError = () => { }) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return FirebaseServices.getDocumentReference(collectionId, documentId)
            .onSnapshot((document) => {
                onDocumentChanged(document);
            }, onError);
    }

    static subscribeToDocumentData(collectionId, documentId, onDocumentChanged = () => { }, onError = () => { }) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return FirebaseServices.subscribeToDocument(collectionId, documentId, (document) => {
            onDocumentChanged(document.data());
        }, onError);
    }

    // Read
    static getCollectionReference(collectionId) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return firestore.collection(collectionId);
    }

    static getCollection(collectionId) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return FirebaseServices.getCollectionReference(collectionId).get();
    }

    static async getCollectionData(collectionId) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        const collection = await FirebaseServices.getCollection(collectionId);
        return collection.docs.map((document) => {
            return document.data();
        });
    }

    static getDocumentReference(collectionId, documentId) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return FirebaseServices.getCollectionReference(collectionId).doc(documentId);
    }

    static getDocument(collectionId, documentId) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        return FirebaseServices.getDocumentReference(collectionId, documentId).get();
    }

    static async getDocumentData(collectionId, documentId) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        const document = await FirebaseServices.getDocument(collectionId, documentId);
        return document.data();
    }

    // Update
    static async updateDocument(collectionId, documentId, data) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        // Define necessary variables outside of the scope of promise and all callbacks to make them accessible from the scope of each callback and the promise.
        let unsubscribe, resolve, reject;
        // Declare update document promise completion state flag. 
        // This will be later used to determinate how to correctly throw firestore synchronization error if needed.
        let completionState = 'pending';
        // Declare counter variable, which will store the value of how many times update document data validation function
        // has been triggered by real time data updates subscription to the updated document.
        let counter = 0;

        // Assign update document data validation function.
        const confirmValidityOfDocumentUpdate = (documentData) => {
            // Increase value of the counter by one.
            counter++;

            // If counter is equal to 1, don't do anything just return as first time real time data is triggered is always contains original, unchanged document data.
            if (counter === 1) return;

            // Unsubscribe from real time document updates to not be executed ever again.
            unsubscribe();

            // Set committed successfully flag to true.
            let committedSuccessfully = true;

            // For each property within the data provided for document update ..
            for (let propName in data)
                // .. perform deep value comparison and if the value of the field of the data object provided for document update
                // is not equivalent to matching field in a document data reported by firestore ..
                if (!ObjectEqualityComparer.deepCompare(data[propName], documentData[propName])) {
                    // .. set committed successfully flag to false ..
                    committedSuccessfully = false;
                    // .. and break out from the loop.
                    break;
                }

            // If committed successfully flag indicates that firestore persisted expected data resolve the pending document update promise.
            if (committedSuccessfully)
                resolve();
            // Otherwise ..
            else {
                // .. serialize both data reported by firestore and data provided for document update ..
                const { dataJSON, documentDataJSON } = safeDataComparisonStringify(data, documentData);
                // .. then use that serialized data to construct appropriate error, and reject the pending document update promise
                // providing that error as a rejection parameter.
                reject(new Error(`Unexpected data updated the document. Expected updates to match provided update object:\n\n${dataJSON}\n\nbut update stored instead:\n\n${documentDataJSON}`));
            }
        };

        // Assign handle document update error function.
        const handleErrorOnDocumentUpdate = (error) => {

            // Unsubscribe from real time document updates to not be executed ever again.
            unsubscribe();

            // Reject the pending document update promise passing error parameter as a rejection parameter.
            reject(error);
        };

        // Return existing document update promise.
        return new Promise(async (resolvePromise, rejectPromise) => {

            // Assign custom promise resolve function which will change function scope variable completionSate
            // appropriately whenever promise will get resolve.
            resolve = (arg) => {
                completionState = 'resolved';
                resolvePromise(arg);
            }

            // Assign custom promise reject function which will change function scope variable completionSate
            // appropriately whenever promise will get rejected.
            reject = (arg) => {
                completionState = 'rejected';
                rejectPromise(arg);
            }

            // Subscribe to real time document data updates with updated document validation function, and error handling function.
            unsubscribe = FirebaseServices.subscribeToDocumentData(collectionId, documentId,
                confirmValidityOfDocumentUpdate, handleErrorOnDocumentUpdate);

            try {
                // Update existing firestore document
                await firestore.collection(collectionId).doc(documentId).update(data);

                // If promise has not been yet resolved by updated document validation function, resolve it.
                if (completionState === 'pending') resolve();
            } catch (error) {
                // If promise has not been yet resolved by updated document validation function,
                // and rejecting promise is still an option, reject it using the caught error as 
                // a rejection parameter.
                if (completionState === 'pending')
                    reject(error);
                // Otherwise if promise already resolved throw the caught error as a firebase critical sync error.                
                else if (completionState === 'resolved')
                    onFirebaseCriticalSyncError(error);
            } finally {
                // Finally unsubscribe from real time document data updates.
                unsubscribe();
            }
        });
    }

    // Delate
    static delateDocument(collectionId, documentId) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        // Define necessary variables outside of the scope of promise and all callbacks to make them accessible from the scope of each callback and the promise.
        let unsubscribe, resolve, reject;
        // Declare delete document promise completion state flag. 
        // This will be later used to determinate how to correctly throw firestore synchronization error if needed.
        let completionState = 'pending';
        // Declare counter variable, which will store the value of how many times delete document data validation function
        // has been triggered by real time data updates subscription to the deleted document.
        let counter = 0;

        // Assign delete document data validation function.
        const confirmValidityOfDocumentDelete = (document) => {
            // Increase value of the counter by one.
            counter++;

            // If counter is equal to 1, don't do anything just return as first time real time data is triggered is always contains original, unchanged document.
            if (counter === 1) return;

            // Unsubscribe from real time document updates to not be executed ever again.
            unsubscribe();

            // If document is marked as no longer existing resolve document delete promise.
            if (!document.exists)
                resolve();
            // Otherwise throw an appropriate error.
            else
                reject(new Error(`Failed to remove document from on path ${collectionId}/${documentId}`));
        };

        // Assign handle document delete error function.
        const handleErrorOnDocumentDelete = (error) => {

            // Unsubscribe from real time document updates to not be executed ever again.
            unsubscribe();

            // Reject the pending document delete promise passing error parameter as a rejection parameter.
            reject(error);
        };

        // Return existing document delete promise.
        return new Promise(async (resolvePromise, rejectPromise) => {

            // Assign custom promise resolve function which will change function scope variable completionSate
            // appropriately whenever promise will get resolve.
            resolve = (arg) => {
                completionState = 'resolved';
                resolvePromise(arg);
            }

            // Assign custom promise reject function which will change function scope variable completionSate
            // appropriately whenever promise will get rejected.
            reject = (arg) => {
                completionState = 'rejected';
                rejectPromise(arg);
            }

            // Subscribe to real time document data updates with deleted document validation function, and error handling function.
            unsubscribe = FirebaseServices.subscribeToDocument(collectionId, documentId,
                confirmValidityOfDocumentDelete, handleErrorOnDocumentDelete);

            try {
                // Delete existing firestore document
                await firestore.collection(collectionId).doc(documentId).delete();

                // If promise has not been yet resolved by deleted document validation function, resolve it.
                if (completionState === 'pending') resolve();
            } catch (error) {
                // If promise has not been yet resolved by deleted document validation function,
                // and rejecting promise is still an option, reject it using the caught error as 
                // a rejection parameter.
                if (completionState === 'pending')
                    reject(error);
                // Otherwise if promise already resolved throw the caught error as a firebase critical sync error.                
                else if (completionState === 'resolved')
                    onFirebaseCriticalSyncError(error);
            } finally {
                // Finally unsubscribe from real time document data updates.
                unsubscribe();
            }
        });
    }

    // Add callback which will be executed whenever Firebase critical sync error occurs. 
    static addOnFirebaseFailure(callback = () => { }) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        onFirebaseFailedCallbacks = [...onFirebaseFailedCallbacks, callback];
    }

    // Removes callback to be executed whenever Firebase critical sync error occurs. 
    static removeOnFirebaseFailure(callback) {
        if (!isInitialized)
            throw new Error('Firebase service is not initialized. Call FirebaseServices.initialize() to initialize it prior to calling any other service methods.');

        onFirebaseFailedCallbacks = onFirebaseFailedCallbacks.filter((cb) => { return cb !== callback; });
    }
}

async function onFirebaseCriticalSyncError(error) {
    // If firebase failure marked already handled do nothing and return.
    if (firebaseFailureHandled) return;

    // Mark firebase failure as handled.
    firebaseFailureHandled = true;

    // Declare array container which will be used to collect any potential errors
    //  occurred while execution each callback in onFirebaseFailedCallbacks.
    const onFirebaseFailureCallbacksErrors = [];

    try {

        // Execute each callback within callbacks array onFirebaseFailedCallbacks
        for (let i = 0; i < onFirebaseFailedCallbacks.length; i++)
            try { await onFirebaseFailedCallbacks[i](); }
            // .. and if any error occurred while executing a callback, 
            // catch the error and push it into callbacks errors array.
            catch (callbackError) { onFirebaseFailureCallbacksErrors.push(callbackError); }

        // Terminate firestore.
        await firestore.terminate();

        // Dispose firebase app
        await firebaseApp.delete();

        // Set all private module fields into they initial values.
        firebaseApp = null;
        firestore = null;
        isInitialized = false;
        isSignedIn = null;
        currentUserUID = null;

        // Construct appropriate FirebaseCriticalSyncError and pass it as an argument when executing firebase critical sync error handler.
        handleFirebaseCriticalSyncError(new FirebaseCriticalSyncError(null, error, null, onFirebaseFailureCallbacksErrors));

        // Catch any errors occurred during firestore termination and firebase disposal.
    } catch (firebaseTerminationError) {
        // Construct appropriate FirebaseCriticalSyncError and pass it as an argument when executing firebase critical sync error handler.
        handleFirebaseCriticalSyncError(new FirebaseCriticalSyncError(null, error, firebaseTerminationError, onFirebaseFailureCallbacksErrors));
    }
}


function safeDataComparisonStringify(data, documentData) {

    let dataJSON, documentDataJSON;

    try { dataJSON = JSON.stringify(data, null, '\t'); }
    catch (error) { dataJSON = '"Non-serializable"' }

    try { documentDataJSON = JSON.stringify(documentData, null, '\t'); }
    catch (error) { dataJSON = '"Non-serializable"' }

    return {
        dataJSON: dataJSON,
        documentDataJSON: documentDataJSON
    }
} 
