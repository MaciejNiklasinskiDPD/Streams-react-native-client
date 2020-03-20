import { AccessToken, LoginManager } from 'react-native-fbsdk';
import OAuth2CancelledError from '../errors/OAuth2CancelledError';

const verificationURL = require('../../oAuth2Config.json').facebookVerificationURL;

export default class FacebookOAuth2 {
    static async signIn() {
        const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);

        if (result.isCancelled)
            throw new OAuth2CancelledError();

        const data = await AccessToken.getCurrentAccessToken();
        const accessToken = data.accessToken.toString();
        const user = await FacebookOAuth2.getUserFromToken(accessToken);

        return {
            token: accessToken,
            user: user
        };
    }

    static signOut() {
        LoginManager.logOut();
    }

    static async getUserFromToken(accessToken) {
        const response = await fetch(verificationURL + accessToken);

        if (response.status !== 200)
            return null;

        const payload = await response.json();

        return {
            name: payload.name,
            email: payload.email,
        };
    }
}