import React, { Component } from 'react'; import {
    View,
    Text
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { streamsButtonStyles as styles } from '../styles'
import { baseFontSize } from '../styles/baseUnits';
import Spinner from './Spinner';

export default class StreamsButton extends Component {
    render() {
        const fontSize = this.props.style && this.props.style.fontSize ? this.props.style.fontSize : baseFontSize;
        return (
            <TouchableOpacity style={this.props.style} onPress={this.props.onPress}>
                {this.props.loading ?
                    <View style={styles.contentContainer}>
                        <Spinner resizeMode="contain" style={styles.spinner} />
                        <Text style={{ fontSize: fontSize }}> Please wait... </Text>
                    </View>
                    :
                    <Text style={{ fontSize: fontSize }}>{this.props.title}</Text>}
            </TouchableOpacity>
        );
    }
}