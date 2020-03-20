import {
    StyleSheet,
} from 'react-native';

import { baseFontSize } from './baseUnits';

export const style = StyleSheet.create({
    contentContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinner: {
        flex: 0.5,
        width: undefined,
        height: undefined,
        alignSelf: 'stretch',
        marginVertical: baseFontSize * 0.2,
        marginRight: baseFontSize * 0.2,
    }
});