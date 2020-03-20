export default class OAuth2CancelledError extends Error {
    constructor(message) {
        if (!message)
            message = "OAuth2 authorization flow has been cancelled by the user.";

        super(message);
    }
}