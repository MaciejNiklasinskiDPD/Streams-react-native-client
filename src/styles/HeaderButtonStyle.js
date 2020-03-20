import {
    StyleSheet
} from 'react-native';
import { baseFontSize } from './baseUnits'

export const style = StyleSheet.create({
    touchableOpacity: {
        display: 'flex',
        flexDirection: 'row',
    },
    image: {
        height: baseFontSize * 2,
        width: baseFontSize * 2
    },
    text: {
        marginTop: baseFontSize * 0.1,
        color: '#157EFB',
        fontSize: baseFontSize * 1.3
    }
});