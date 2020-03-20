import {
    StyleSheet,
    Dimensions,
    Platform,
    StatusBar
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { baseFontSize } from './baseUnits';
import { getOrientation } from '../utils/ScreenServices';

const hasNotch = DeviceInfo.hasNotch();

export const osHeaderHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export function getHeaderHeight() {
    const orientation = getOrientation();

    // Vertical ios
    if (Platform.OS === 'ios' && orientation === 'vertical')
        return hasNotch ? (baseFontSize * 4.5) : (baseFontSize * 4);
    // Horizontal ios
    else if (Platform.OS === 'ios')
        return (baseFontSize * 2);
    // Vertical android
    else if (orientation === 'vertical')
        return (baseFontSize * 5.5);
    // Horizontal android
    else {
        return (baseFontSize * 4);
    }
}


export function get() {
    const window = Dimensions.get('window');
    const orientation = getOrientation();

    const mainContainer = {
        backgroundColor: 'white',
        width: window.width,
        height: getHeaderHeight() - osHeaderHeight,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    };

    const mainContainerVerticalWithNotch = {
        ...mainContainer,
        alignItems: 'flex-end',
        paddingBottom: baseFontSize * 0.5
    };

    return StyleSheet.create({
        mainContainerHidden: {
            display: "none"
        },
        mainContainer: hasNotch && orientation === 'vertical' ? mainContainerVerticalWithNotch : mainContainer,
        backButtonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            minWidth: baseFontSize * 6,
            marginLeft: Platform.OS === 'ios' && orientation === 'horizontal' ? baseFontSize * 0.75 : 0
        },
        forwardButtonContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            minWidth: baseFontSize * 6,
            marginRight: Platform.OS === 'ios' && orientation === 'horizontal' ? baseFontSize * 0.75 : 0
        },
        text: {
            flex: 1,
            textAlign: 'center',
            fontWeight: '500',
            fontSize: baseFontSize * 1.3
        }
    });
}