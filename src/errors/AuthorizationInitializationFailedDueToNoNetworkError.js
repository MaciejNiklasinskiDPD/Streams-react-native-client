import NoNetworkError from './NoNetworkError';
export default class AuthorizationInitializationFailedDueToNoNetworkError extends NoNetworkError {
    constructor(message, initializeAndSignInWith = null) {
        if (!message)
            message = "Unable to initialize authorization service with no internet connection";
        super(message);
        this.initializeAndSignInWith = initializeAndSignInWith;
    }
}