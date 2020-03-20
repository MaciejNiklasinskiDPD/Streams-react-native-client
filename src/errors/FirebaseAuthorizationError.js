export default class FirebaseAuthorizationError extends Error {
    constructor(message, innerError) {
        super(message);

        this.innerError = innerError;
    }
}