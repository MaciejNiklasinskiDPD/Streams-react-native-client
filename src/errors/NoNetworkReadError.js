import NoNetworkError from './NoNetworkError';
export default class NoNetworkReadError extends NoNetworkError {
    constructor(message) {
        super(message);
    }
}