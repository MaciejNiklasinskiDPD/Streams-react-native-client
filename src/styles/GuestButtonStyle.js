import {
    StyleSheet
} from 'react-native';
import { baseFontSize } from './baseUnits'

export const style = StyleSheet.create({
    touchableOpacity: {
        height: baseFontSize * 4.1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    buttonContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        height: baseFontSize * 4,
        minWidth: 320,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },
    buttonImage: {
        marginLeft: baseFontSize * 0.75,
        marginTop: baseFontSize * 0.25,
        height: baseFontSize * 3.5,
        width: baseFontSize * 3.5,
        marginRight: - baseFontSize * 2
    },
    buttonText: {
        marginTop: baseFontSize * 1.1,
        textAlign: 'center',
        textDecorationLine: 'underline',
        flex: 1,
        fontSize: baseFontSize * 1.3,
    }
});