import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { baseFontSize } from './baseUnits';

import { styles } from './baseStyles';

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

export const style = StyleSheet.create({
    mainContainer: {
        borderStyle: 'solid',
        borderBottomColor: 'grey',
        borderBottomWidth: 2,

        marginVertical: baseFontSize * 0.25,
        marginHorizontal: baseFontSize * 0.5,
    },
    title: {
        marginVertical: baseFontSize * 0.25,
        fontSize: baseFontSize * 1.3,
        fontWeight: '400'

    },
    description: {
        fontSize: baseFontSize * 1,
        fontWeight: '300'
    },
    buttonsContainer: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-around',
        maxWidth: windowHeight > windowWidth ? windowWidth : windowHeight
    },
    showButton: {
        ...styles.baseButtonStyle,
        backgroundColor: '#2980b9',
    },
    editButton: {
        ...styles.baseButtonStyle,
        backgroundColor: '#e67e22'
    },
    deleteButton: {
        ...styles.baseButtonStyle,
        backgroundColor: '#e84118'
    }
});
