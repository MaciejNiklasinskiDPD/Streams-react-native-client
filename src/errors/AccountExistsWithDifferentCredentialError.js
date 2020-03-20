export default class AccountExistsWithDifferentCredentialError extends Error {
    constructor() {
        super("An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.");
    }
}