import NoNetworkError from './NoNetworkError';
export default class UnableToSignOutDueToNoNetworkError extends NoNetworkError {
    constructor(message, signOutFrom = null) {
        if (!message)
            message = "Unable to sign out with no internet connection";
        super(message);
        this.signOutFrom = signOutFrom;
    }
}