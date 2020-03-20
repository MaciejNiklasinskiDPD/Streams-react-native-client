import {
    Dimensions
} from 'react-native';

const window = Dimensions.get('window');

const windowHeight = window.height > window.width ? window.height : window.width;

export const baseFontSize = windowHeight / 56;