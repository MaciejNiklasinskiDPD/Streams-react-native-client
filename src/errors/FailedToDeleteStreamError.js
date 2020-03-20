export default class FailedToDeleteStreamError extends Error {
    constructor(message, innerError) {
        if (!message && !innerError)
            message = "Failed to delete a stream.";
        else if (!message)
            message = `Failed to delete a stream. See inner exception details:\n ${innerError}`;

        super(message);
    }
}