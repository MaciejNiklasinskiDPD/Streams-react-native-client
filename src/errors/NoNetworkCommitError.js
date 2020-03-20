import NoNetworkError from './NoNetworkError';
export default class NoNetworkCommitError extends NoNetworkError {
    constructor(message) {
        super(message);
    }
}