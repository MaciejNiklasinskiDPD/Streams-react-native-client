import * as Keychain from 'react-native-keychain';
import { AccessToken } from 'react-native-fbsdk';

import GoogleOAuth2 from './GoogleOAuth2';
import FacebookOAuth2 from './FacebookOAuth2';
import FirebaseServices from './FirebaseServices';

import AccountExistsWithDifferentCredentialError from '../errors/AccountExistsWithDifferentCredentialError';

let isInitialized = false;
let sessionState = null;

export default class AuthorizationServices {
    static async initialize(handleFirebaseCriticalSyncError) {
        // If authorization service already has been initialized do nothing and return.
        if (isInitialized)
            return;

        // Get facebook session state.
        sessionState = await getFacebookSessionState();

        // If session state still indicates that user is not signed in with any provider..
        if (!sessionState.sessionProvider)
            // .. get google session state.
            sessionState = await getGoogleSessionState();

        // Initialize firebase.
        sessionState.uid = await FirebaseServices.initialize(async (error) => {
            isInitialized = false;
            sessionState = null;
            await handleFirebaseCriticalSyncError(error);
        });


        // If user is signed in with an oAuth2 session provider, and is also signed into the firebase ..
        if ((sessionState.sessionProvider && FirebaseServices.isSignedIn())
            // .. or user is not signed in with any of oAuth2 session providers and  is also not signed in to firebase ..
            || (!sessionState.sessionProvider && !FirebaseServices.isSignedIn())) {
            // .. set isInitialized flag to true ..
            isInitialized = true;
            // .. and return.
            return;
        }
        // Otherwise if user is signed in to firebase but is not signed in with any of the oAuth2 session providers ..
        else if (!sessionState.sessionProvider && FirebaseServices.isSignedIn()) {
            // .. set isInitialized flag to true, ..
            isInitialized = true;
            // .. sign out from firebase and return.
            return FirebaseServices.signOut();
        }

        // If user is signed in with any oAuth2 session provider, but is not signed in to firebase.

        // Check with which oAuth2 session provider user is currently signed in, and sign it to firebase with it's credentials.
        if (sessionState.sessionProvider === 'Google')
            sessionState.uid = await FirebaseServices.signInWithGoogle(sessionState.token);
        else
            try { sessionState.uid = await FirebaseServices.signInWithFacebook(sessionState.token); }
            catch (error) {
                if (error instanceof AccountExistsWithDifferentCredentialError === false)
                    throw error;

                FacebookOAuth2.signOut();

                sessionState = new SessionState(null, null, null, null);

                await AuthorizationServices.signInWithGoogle();
            }

        // Set isInitialized flag to true ..
        isInitialized = true;
        // .. and return.
        return;
    }

    // Returns current session state, or throws appropriate exception if no session state is available because service hasn't been yet initialized.
    static getSessionState() {
        if (!isInitialized)
            throw new Error('Authorization service is not initialized. Call AuthorizationServices.initialize() to initialize it prior to calling any other service methods.');

        return sessionState;
    }

    // Sign in using google version on oAuth2 authentication.
    static async signInWithGoogle() {
        if (!isInitialized)
            throw new Error('Authorization service is not initialized. Call AuthorizationServices.initialize() to initialize it prior to calling any other service methods.');
        else if (sessionState.sessionProvider)
            throw new Error('Already signed in and as such unable to sing in again.');

        const oAuth2Profile = await GoogleOAuth2.signIn();

        await storeGoogleToken(oAuth2Profile.token);

        const uid = await FirebaseServices.signInWithGoogle(oAuth2Profile.token);

        sessionState = new SessionState('Google', oAuth2Profile.token, oAuth2Profile.user, uid);

        if (!await FirebaseServices.isDocumentExists('users', uid))
            await FirebaseServices.createDocument('users', uid, { name: oAuth2Profile.user.name, email: oAuth2Profile.user.email });

    }

    // Sign in using facebook version on oAuth2 authentication.
    static async signInWithFacebook() {
        if (!isInitialized)
            throw new Error('Authorization service is not initialized. Call AuthorizationServices.initialize() to initialize it prior to calling any other service methods.');
        else if (sessionState.sessionProvider)
            throw new Error('Already signed in and as such unable to sing in again.');

        try {
            const oAuth2Profile = await FacebookOAuth2.signIn();

            const uid = await FirebaseServices.signInWithFacebook(oAuth2Profile.token);

            sessionState = new SessionState('Facebook', oAuth2Profile.token, oAuth2Profile.user, uid);

            if (!await FirebaseServices.isDocumentExists('users', uid))
                await FirebaseServices.createDocument('users', uid, { name: oAuth2Profile.user.name, email: oAuth2Profile.user.email });
        }
        catch (error) {
            if (error instanceof AccountExistsWithDifferentCredentialError === false)
                throw error;

            FacebookOAuth2.signOut();

            sessionState = new SessionState(null, null, null, null);

            return AuthorizationServices.signInWithGoogle();
        }
    }

    // Sign out.
    static async signOut() {
        if (!isInitialized)
            throw new Error('Authorization service is not initialized. Call AuthorizationServices.initialize() to initialize it prior to calling any other service methods.');

        if (sessionState.sessionProvider === 'Facebook')
            FacebookOAuth2.signOut();

        sessionState = new SessionState(null, null, null, null);

        await resetGoogleToken();

        return FirebaseServices.signOut();
    }
}

// An object representing authorization session state.
class SessionState {
    constructor(sessionProvider, token, user, uid) {
        this.sessionProvider = sessionProvider;
        this.token = token;
        this.user = user;
        this.uid = uid;
    }
}

// Retrieves current google oAuth2 session state.
async function getGoogleSessionState() {
    // Attempt to obtain any stored google oAuth2 tokens.
    const token = await getGoogleToken();

    // If no token has been retrieved return empty session state.
    if (!token)
        return new SessionState(null, null, null, null);

    // Obtain the user using provided token.
    const user = await GoogleOAuth2.getUserFromToken(token);

    // If no user data has been retrieved, return empty session state.
    if (!user)
        return new SessionState(null, null, null, null);

    // Return google session state.
    return new SessionState('Google', token, user, null);
}

// Retrieves current facebook oAuth2 session state.
async function getFacebookSessionState() {
    // Attempt to obtain facebook oAuth2 token data.
    const data = await AccessToken.getCurrentAccessToken();

    // If no data has been retrieved return empty session state.
    if (!data)
        return new SessionState(null, null, null, null);

    // Retrieve facebook access token from the token data.
    const token = data.accessToken.toString();

    // Obtain the user using provided token.
    const user = await FacebookOAuth2.getUserFromToken(token);

    // If no user data has been retrieved, return empty session state.
    if (!user)
        return new SessionState(null, null, null, null);

    // Return facebook session state.
    return new SessionState('Facebook', token, user, null);
}

// Stores the provided token within the keychain.
function storeGoogleToken(idToken) {
    return Keychain.setGenericPassword('Google', idToken);
}

// Returns any stored google token or returns null if no token has been stored.
async function getGoogleToken() {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.password)
        return credentials.password;
    else
        return null;
}

// Removes any google token stored within the keychain.
function resetGoogleToken() {
    return Keychain.resetGenericPassword();
}