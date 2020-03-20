import { authorize } from 'react-native-app-auth';
import OAuth2CancelledError from '../errors/OAuth2CancelledError';

const verificationURL = require('../../oAuth2Config.json').googleVerificationURL;

// base config
let config;
// IOS
if (Platform.OS === 'ios')
    config = require('../../oAuth2Config.json').googleIOS;
// Android
else
    config = require('../../oAuth2Config.json').googleAndroid;

export default class GoogleOAuth2 {
    static async signIn() {
        let result = null;
        try {
            result = await authorize(config);
        } catch (error) {
            if (error.message === 'User cancelled flow'
                || error.message === 'OAuth2 authorization flow has been cancelled by the user.'
                || error.message === 'The operation couldn’t be completed. (org.openid.appauth.general error -3.)')
                throw new OAuth2CancelledError();

            throw error;
        }

        const user = await GoogleOAuth2.getUserFromToken(result.idToken);

        return {
            token: result.idToken,
            user: user
        };
    }

    static async getUserFromToken(token) {

        const response = await fetch(verificationURL + token);

        if (response.status !== 200)
            return null;

        const payload = await response.json();

        return {
            name: `${payload.given_name} ${payload.family_name}`,
            email: payload.email,
        };
    }
}