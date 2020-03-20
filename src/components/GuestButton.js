import React, { Component } from 'react';
import { connect } from 'react-redux';
import { guestButtonStyle as styles } from '../styles';
import {
    View,
    Image,
    Text,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    navigateTo
} from '../actions'

function mapStateToProps(state) {
    return { ...state.authorization };
}

export default connect(mapStateToProps, {
    navigateTo: navigateTo
})(class GuestButton extends Component {
    constructor(props) {
        super(props);

        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        const { isSignedIn, asyncOperationIsOngoing } = this.props;

        if (asyncOperationIsOngoing || isSignedIn)
            return;

        this.props.navigateTo({
            id: 'StreamsIndex',
            props: null,
            title: 'Streams'
        });

    }

    render() {
        return (
            <View style={this.props.style}>
                <TouchableOpacity style={styles.touchableOpacity} onPress={this.onPress}>
                    <View style={styles.buttonContainer}>
                        <Image style={styles.buttonImage} source={require('../../resources/images/play-circle.png')} />
                        <Text style={styles.buttonText}>Continue as Guest</Text>
                    </View>
                </TouchableOpacity>
            </View>);
    }
});