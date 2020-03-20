import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    Text
} from 'react-native';
import { googleButtonStyle as styles } from '../styles'
import {
    trySignInWithGoogle,
    trySignOut
} from '../actions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from './Spinner';

function mapStateToProps(state) {
    return { ...state.authorization };
}

export default connect(mapStateToProps, {
    trySignInWithGoogle: trySignInWithGoogle,
    trySignOut: trySignOut
})(class GoogleButton extends Component {
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
            this.props.trySignInWithGoogle();
        else
            this.props.trySignOut();
    }

    render() {
        return (
            <View style={this.props.style}>
                <TouchableOpacity style={styles.touchableOpacity} onPress={this.onPress}>
                    <View style={styles.googleButtonContainer}>
                        {this.renderImage()}
                        <Text style={styles.googleButtonText}>{this.getButtonText()}</Text>
                    </View>
                </TouchableOpacity>
            </View>);
    }

    renderImage() {
        const { asyncOngoingAuthWith } = this.props;

        if (asyncOngoingAuthWith === 'Google')
            return <Spinner style={styles.googleButtonImage} />;
        else
            return <Image style={styles.googleButtonImage} source={require('../../resources/images/logo-google.png')} />;
    }

    getButtonText() {
        const { isSignedIn } = this.props;

        if (!isSignedIn)
            return 'Sign In With Google';
        else
            return 'Sign Out With Google';
    }
});