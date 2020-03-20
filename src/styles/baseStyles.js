import {
    StyleSheet,
} from 'react-native';
import { baseFontSize } from './baseUnits';

export const styles = StyleSheet.create({
    baseButtonStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: baseFontSize * 1,
        minHeight: baseFontSize * 2,
        minWidth: baseFontSize * 6,
        borderRadius: baseFontSize * 0.5,


        marginVertical: baseFontSize * 1,
        marginHorizontal: baseFontSize * 1,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    }
});