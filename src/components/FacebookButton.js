import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    Text
} from 'react-native';
import { facebookButtonStyle as styles } from '../styles'
import {
    trySignInWithFacebook,
    trySignOut
} from '../actions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from './Spinner';

function mapStateToProps(state) {
    return { ...state.authorization };
}

export default connect(mapStateToProps, {
    trySignInWithFacebook: trySignInWithFacebook,
    trySignOut: trySignOut
})(class FacebookButton extends Component {
    constructor(props) {
        super(props);

        this.onPress = this.onPress.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.getButtonText = this.getButtonText.bind(this);
    }

    onPress() {
        const { isSignedIn, asyncOperationIsOngoing } = this.props;

        if (asyncOperationIsOngoing) return;

        if (!isSignedIn)
            this.props.trySignInWithFacebook();
        else
            this.props.trySignOut();
    }

    render() {
        return (
            <View style={this.props.style}>
                <TouchableOpacity style={styles.touchableOpacity} onPress={this.onPress}>
                    <View style={styles.facebookButtonContainer}>
                        {this.renderImage()}
                        <Text style={styles.facebookButtonText}>{this.getButtonText()}</Text>
                    </View>
                </TouchableOpacity>
            </View>);
    }

    renderImage() {
        const { asyncOngoingAuthWith } = this.props;

        if (asyncOngoingAuthWith === 'Facebook')
            return <Spinner style={styles.facebookButtonImage} />;
        else
            return <Image style={styles.facebookButtonImage} source={require('../../resources/images/logo-facebook.png')} />;
    }

    getButtonText() {
        const { isSignedIn } = this.props;

        if (!isSignedIn)
            return 'Sign In With Facebook';
        else
            return 'Sign Out With Facebook';
    }
});