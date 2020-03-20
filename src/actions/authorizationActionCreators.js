import AuthorizationServices from '../utils/AuthorizationServices';
import {
    ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
    TRY_INITIALIZE,
    TRY_SIGN_IN_WITH_GOOGLE,
    TRY_SIGN_IN_WITH_FACEBOOK,
    TRY_SIGN_OUT,
    CLEAR_AUTHORIZATION_ERROR
} from './types'

import {
    navigateBackHome
} from './navigationActionCreators'

import {
    onFirebaseCriticalSyncError
} from './streamsActionCreators'

import OAuth2CancelledError from '../errors/OAuth2CancelledError';
import AuthorizationInitializationFailedDueToNoNetworkError from '../errors/AuthorizationInitializationFailedDueToNoNetworkError';
import UnableToSignInDueToNoNetworkError from '../errors/UnableToSignInDueToNoNetworkError';
import UnableToSignOutDueToNoNetworkError from '../errors/UnableToSignOutDueToNoNetworkError';

import InternetConnectionServices from '../utils/InternetConnectionServices';

import {
    navigateTo
} from './navigationActionCreators'

export function clearAuthorizationError() {
    return {
        type: CLEAR_AUTHORIZATION_ERROR
    }
}

export function tryInitialize() {
    return async (dispatch, getState) => {

        const authorizationState = getState().authorization;

        let error = null;
        let isInitialized = authorizationState.isInitialized;
        let session = null;

        if (isInitialized)
            return;

        await dispatch({
            type: ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: true,
                asyncOngoingAuthWith: null
            }
        });

        try {
            const handleFirebaseCriticalSyncError = getFirebaseCriticalSyncErrorHandler(dispatch);

            if (await InternetConnectionServices.isConnected()) {
                await AuthorizationServices.initialize(handleFirebaseCriticalSyncError);
                session = AuthorizationServices.getSessionState();
                isInitialized = true;
            } else {
                error = new AuthorizationInitializationFailedDueToNoNetworkError();
                postponeInitializationTillConnectionReestablished(dispatch);
            }
        }
        catch (err) {
            console.log(err);
            error = err;
        }

        let isSignedIn, isSignedInWith, user, uid = null;

        if (session) {
            isSignedIn = session.sessionProvider ? true : false;
            isSignedInWith = session.sessionProvider;
            user = session.user;
            uid = session.uid;
        }

        await dispatch({
            type: TRY_INITIALIZE,
            payload: {
                isInitialized: isInitialized,
                isSignedIn: isSignedIn,
                isSignedInWith: isSignedInWith,
                user: user,
                uid: uid,
                error: error
            }
        });

        await dispatch({
            type: ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: false,
                asyncOngoingAuthWith: null
            }
        });

        if (getState().authorization.isSignedIn)
            dispatch(navigateTo({
                id: 'StreamsIndex',
                props: null,
                title: 'Streams'
            }));
    }
}

export function trySignInWithGoogle() {
    return async (dispatch, getState) => {

        let { isInitialized, isSignedIn } = getState().authorization;
        let error, session = null;

        if (isSignedIn)
            return;

        await dispatch({
            type: ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: true,
                asyncOngoingAuthWith: 'Google'
            }
        });

        try {
            if (!await InternetConnectionServices.isConnected())
                throw new UnableToSignInDueToNoNetworkError(null, 'Google');

            if (!isInitialized)
                return;

            await AuthorizationServices.signInWithGoogle();
            session = AuthorizationServices.getSessionState();
            isSignedIn = true;
        }
        catch (err) {
            if (err instanceof OAuth2CancelledError === false)
                error = err;

            console.log(err);
        }

        await dispatch({
            type: TRY_SIGN_IN_WITH_GOOGLE,
            payload: {
                isSignedIn: isSignedIn,
                isSignedInWith: session ? session.sessionProvider : null,
                user: session ? session.user : null,
                uid: session ? session.uid : null,
                error: error
            }
        });

        await dispatch({
            type: ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: false,
                asyncOngoingAuthWith: null
            }
        });

        if (getState().authorization.isSignedIn)
            dispatch(navigateTo({
                id: 'StreamsIndex',
                props: null,
                title: 'Streams'
            }));
    }
}

export function trySignInWithFacebook() {
    return async (dispatch, getState) => {

        let { isInitialized, isSignedIn } = getState().authorization;
        let error, session = null;

        if (isSignedIn)
            return;

        await dispatch({
            type: ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: true,
                asyncOngoingAuthWith: 'Facebook'
            }
        });

        try {
            if (!await InternetConnectionServices.isConnected())
                throw new UnableToSignInDueToNoNetworkError(null, 'Facebook');

            if (!isInitialized)
                return;

            await AuthorizationServices.signInWithFacebook();
            session = AuthorizationServices.getSessionState();
            isSignedIn = true;
        }
        catch (err) {
            if (err instanceof OAuth2CancelledError === false)
                error = err;

            console.log(err);
        }

        await dispatch({
            type: TRY_SIGN_IN_WITH_FACEBOOK,
            payload: {
                isSignedIn: isSignedIn,
                isSignedInWith: session ? session.sessionProvider : null,
                user: session ? session.user : null,
                uid: session ? session.uid : null,
                error: error
            }
        });

        await dispatch({
            type: ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: false,
                asyncOngoingAuthWith: null
            }
        });

        if (getState().authorization.isSignedIn)
            dispatch(navigateTo({
                id: 'StreamsIndex',
                props: null,
                title: 'Streams'
            }));
    }
}

export function trySignOut() {
    return async (dispatch, getState) => {

        let { isInitialized, isSignedIn, isSignedInWith } = getState().authorization;
        let error, session = null;

        if (!isSignedIn)
            return;

        await dispatch({
            type: ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: true,
                asyncOngoingAuthWith: getState().authorization.isSignedInWith
            }
        });

        try {
            if (!await InternetConnectionServices.isConnected())
                throw new UnableToSignOutDueToNoNetworkError(null, isSignedInWith);

            if (!isInitialized)
                return;

            await AuthorizationServices.signOut();
            session = AuthorizationServices.getSessionState();
            isSignedIn = false;
        }
        catch (err) {
            console.log(err);
            error = err;
        }

        await dispatch({
            type: TRY_SIGN_OUT,
            payload: {
                isSignedIn: isSignedIn,
                isSignedInWith: session ? session.sessionProvider : null,
                user: session ? session.user : null,
                uid: session ? session.uid : null,
                error: error
            }
        });

        await dispatch({
            type: ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: false,
                asyncOngoingAuthWith: null
            }
        });
    }
}

function postponeInitializationTillConnectionReestablished(dispatch) {
    InternetConnectionServices.executeOnConnectionReestablished(async () => {
        await dispatch(tryInitialize());
    });
}

function getFirebaseCriticalSyncErrorHandler(dispatch) {
    return async (error) => {
        console.log(error);
        await dispatch(navigateBackHome());
        await dispatch(onFirebaseCriticalSyncError());
        await dispatch({
            type: TRY_INITIALIZE,
            payload: {
                isInitialized: false,
                isSignedIn: null,
                isSignedInWith: null,
                user: null,
                uid: null,
                error: error
            }
        });
    }
}