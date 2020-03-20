import {
    StyleSheet,
} from 'react-native';
import { baseFontSize } from './baseUnits';

import { styles } from './baseStyles';
import { trueScreenWidth } from '../utils/ScreenServices'

export const style = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    scrollViewContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    contentContainer: {
        minWidth: trueScreenWidth * 1,
    },
    createButton: {
        ...styles.baseButtonStyle,
        backgroundColor: '#95a5a6',
        marginVertical: baseFontSize * 1,
        marginHorizontal: baseFontSize * 2
    }
});
