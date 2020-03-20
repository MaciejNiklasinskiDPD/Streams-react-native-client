import NoNetworkError from './NoNetworkError';
export default class UnableToSignInDueToNoNetworkError extends NoNetworkError {
    constructor(message, oAuth2Provider = null) {
        if (!message)
            message = "Unable to sign in with no internet connection";
        super(message);
        this.oAuth2Provider = oAuth2Provider;
    }
}