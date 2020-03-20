import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { baseFontSize } from './baseUnits';

import { styles } from './baseStyles';
import { getHeaderHeight, osHeaderHeight } from './HeaderStyle'

export function get() {
    const window = Dimensions.get('screen');
    const headerHeight = getHeaderHeight();

    return StyleSheet.create({
        mainContainerVertical: {
            paddingTop: baseFontSize * 2,
            height: window.height - headerHeight,
            display: 'flex',
            flexDirection: 'column',
        },
        mainContainerHorizontal: {
            height: window.height - osHeaderHeight,
        },
        playerContainerVertical: {
            width: window.width,
            height: (window.width * 9) / 16
        },
        playerContainerHorizontal: {
            width: window.width,
            height: window.height,
        },
        title: {
            margin: baseFontSize * 0.5,
            fontSize: baseFontSize * 1.5,
            fontWeight: '400'
        },
        description: {
            marginHorizontal: baseFontSize * 0.5,
            marginBottom: baseFontSize * 0.3,
            fontSize: baseFontSize * 1.2
        },
        id: {
            marginHorizontal: baseFontSize * 0.5,
            fontSize: baseFontSize * 1.2
        }
    });
}