import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const trueScreenHeight = height > width ? height : width;
export const trueScreenWidth = height > width ? width : height;

export function getOrientation() {
    const { height, width } = Dimensions.get('window');

    if (height > width) return 'vertical';
    else return 'horizontal';
}