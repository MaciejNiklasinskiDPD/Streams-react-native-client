import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { getHeaderHeight } from './HeaderStyle'
import { baseFontSize } from './baseUnits';
import { trueScreenHeight } from '../utils/ScreenServices';

export function get() {
    const { height: windowHeight } = Dimensions.get('window');

    const headerHeight = getHeaderHeight();

    return StyleSheet.create({
        scrollView: {
            height: windowHeight - headerHeight
        },
        mainContainer: {
            height: trueScreenHeight - headerHeight,
            display: 'flex',
            flexDirection: 'column'
        },
        logoContainer: {
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        logo: {
            height: baseFontSize * 25,
            width: baseFontSize * 25,
        },
        spinner: {
            height: baseFontSize * 20,
            width: baseFontSize * 20,
        },
        logoText: {
            fontSize: baseFontSize * 3,
            fontWeight: '300',
            textAlign: 'center',
            marginHorizontal: '3%',
        },
        buttonsContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: '5%',
            paddingRight: '5%'
        },
        button: {
            backgroundColor: 'white',
            borderRadius: 10,
            maxWidth: 400,
            marginVertical: baseFontSize * 0.3,
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
}