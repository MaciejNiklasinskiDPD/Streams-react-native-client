import { generateSecureRandom } from 'react-native-securerandom';

export default class RandomValuesProvider {
    static getBytes(length) {
        return generateSecureRandom(length);
    }

    static async getString(length) {
        const randomBytes = await RandomValuesProvider.getBytes(length);
        let randomString = ''

        randomBytes.forEach((randomByte) => {
            randomString += randomByte.toString(16);
        });

        return randomString;
    }
}