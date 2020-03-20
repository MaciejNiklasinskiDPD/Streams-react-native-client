import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { baseFontSize, } from './baseUnits';

import { styles } from './baseStyles';

export function get() {
    const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

    return StyleSheet.create({
        mainContainer: {
            paddingTop: windowHeight / 10,
            paddingHorizontal: baseFontSize * 2,
            height: windowHeight,
            display: 'flex',
            flexDirection: 'column',
        },
        title: {
            fontSize: baseFontSize * 2,
            fontWeight: '400'
        },
        inputFieldContainer: {
            marginTop: baseFontSize * 1
        },
        inputFieldTitle: {
            marginBottom: baseFontSize * 0.5,
            fontSize: baseFontSize * 1.3,
            fontWeight: '400'
        },
        inputFieldInput: {
            fontSize: baseFontSize * 1.3,
            color: 'black',
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: 1,
            padding: baseFontSize * 0.3,
        },
        inputFieldError: {
            fontSize: baseFontSize * 1.3,
            color: 'red'
        },
        buttonContainer: {
            display: 'flex',
            alignItems: 'center',
            borderStyle: 'solid',
            borderBottomColor: 'grey',
            borderBottomWidth: 2
        },
        submitButton: {
            ...styles.baseButtonStyle,
            minWidth: baseFontSize * 10,
            backgroundColor: '#95a5a6'
        }
    });
}