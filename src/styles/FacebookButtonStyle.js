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
        overflow: 'hidden',
    },
    facebookButtonContainer: {
        backgroundColor: '#375C94',
        borderRadius: 7,
        height: baseFontSize * 4,
        minWidth: 320,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },
    facebookButtonImage: {
        marginLeft: baseFontSize * 0.75,
        marginTop: baseFontSize * 0.25,
        height: baseFontSize * 3.5,
        width: baseFontSize * 3.5,
        marginRight: - baseFontSize * 2
    },
    facebookButtonText: {
        marginTop: baseFontSize * 1.1,
        textAlign: 'center',
        textDecorationLine: 'underline',
        flex: 1,
        fontSize: baseFontSize * 1.3,
        color: 'white'
    }
});