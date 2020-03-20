import {
    StyleSheet,
    Dimensions
} from 'react-native';
import { baseFontSize } from './baseUnits';

import { getHeaderHeight, osHeaderHeight } from './HeaderStyle'
import { get } from './ShowStreamScreenStyle';
import { trueScreenHeight, trueScreenWidth } from '../utils/ScreenServices';

const headerHeight = getHeaderHeight();
const styles = get();

export const style = StyleSheet.create({
    mainContainer: {
        paddingTop: baseFontSize * 2,
        height: trueScreenHeight - headerHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    playerContainer: {
        width: trueScreenWidth,
        height: (trueScreenWidth * 9) / 16
    },
    title: styles.title,
    description: styles.description,
    id: styles.id
});