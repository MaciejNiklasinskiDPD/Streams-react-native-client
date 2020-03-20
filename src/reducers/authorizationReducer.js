import {
    ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE,
    CLEAR_AUTHORIZATION_ERROR,
    TRY_INITIALIZE,
    TRY_SIGN_IN_WITH_GOOGLE,
    TRY_SIGN_IN_WITH_FACEBOOK,
    TRY_SIGN_OUT
} from '../actions/types'

const initialState = {
    asyncOperationIsOngoing: false,
    asyncOngoingAuthWith: null,
    isInitialized: false,
    isSignedIn: null,
    isSignedInWith: null,
    user: null,
    uid: null,
    error: null
}

export default function authorizationReducer(state = initialState, action) {
    switch (action.type) {
        case ONGOING_AUTHORIZATION_OPERATION_STATE_CHANGE:
            return {
                ...state,
                asyncOperationIsOngoing: action.payload.asyncOperationIsOngoing,
                asyncOngoingAuthWith: action.payload.asyncOngoingAuthWith
            }
        case CLEAR_AUTHORIZATION_ERROR:
            return {
                ...state,
                error: null
            }
        case TRY_INITIALIZE:
            return {
                ...state,
                isInitialized: action.payload.isInitialized,
                isSignedIn: action.payload.isSignedIn,
                isSignedInWith: action.payload.isSignedInWith,
                user: action.payload.user,
                uid: action.payload.uid,
                error: action.payload.error
            }
        case TRY_SIGN_IN_WITH_GOOGLE:
        case TRY_SIGN_IN_WITH_FACEBOOK:
        case TRY_SIGN_OUT:
            return {
                ...state,
                isSignedIn: action.payload.isSignedIn,
                isSignedInWith: action.payload.isSignedInWith,
                user: action.payload.user,
                uid: action.payload.uid,
                error: action.payload.error
            }

        default: return state;
    }
}