export default class FailedToCreateStreamError extends Error {
    constructor(message, innerError) {
        if (!message && !innerError)
            message = "Failed to create a stream.";
        else if (!message)
            message = `Failed to create a stream. See inner exception details:\n ${innerError}`;

        super(message);
    }
}