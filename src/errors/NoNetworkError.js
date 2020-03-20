export default class NoNetworkError extends Error {
    constructor(message) {
        if (!message)
            message = "Internet connection is currently not available.";

        super(message);
    }
}