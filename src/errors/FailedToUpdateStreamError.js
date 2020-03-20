export default class FailedToUpdateStreamError extends Error {
    constructor(message, innerError) {
        if (!message && !innerError)
            message = "Failed to update a stream.";
        else if (!message)
            message = `Failed to update a stream. See inner exception details:\n ${innerError}`;

        super(message);
    }
}