import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    ScrollView,
    Image,
    Text,
    BackHandler
} from 'react-native';
import { getLogInScreenStyle as getStyles } from '../styles'
import {
    setScreenOrientation,
    setHomeScreen,
    tryInitialize,
    clearAuthorizationError,
    setNavigationMethod,
    navigateBackHome,
    navigateBack,
    navigateTo
} from '../actions';
import { getOrientation } from '../utils/ScreenServices'

import GoogleButton from '../components/GoogleButton';
import FacebookButton from '../components/FacebookButton';
import GuestButton from '../components/GuestButton';
import Spinner from '../components/Spinner';
import AuthorizationErrorAlert from '../components/AuthorizationErrorAlert';

function mapStateToProps(state) {
    return { ...state.authorization, ...state.screenOrientation };
}

export default connect(mapStateToProps, {
    setScreenOrientation: setScreenOrientation,
    clearAuthorizationError: clearAuthorizationError,
    tryInitialize: tryInitialize,
    setHomeScreen: setHomeScreen,
    setNavigationMethod: setNavigationMethod,
    navigateBackHome: navigateBackHome,
    navigateBack: navigateBack,
    navigateTo: navigateTo,
})(class LogInScreen extends Component {
    constructor(props) {
        super(props);

        this.renderImage = this.renderImage.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.handleHardwareBackPress = this.handleHardwareBackPress.bind(this);
    }

    onLayout() {
        const currentOrientation = getOrientation();

        if (currentOrientation !== this.props.orientation)
            this.props.setScreenOrientation(currentOrientation);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackPress);

        this.props.setScreenOrientation(getOrientation());
        this.props.setNavigationMethod(this.props.navigation.navigate);
        this.props.setHomeScreen({
            id: 'LogIn',
            props: null,
            title: 'Poor mans\'s twitch'
        });
        this.props.tryInitialize();

    }

    handleHardwareBackPress() {
        this.props.navigateBack();
        // Returns true to prevent default behavior.
        return true;
    }


    render() {
        const styles = getStyles();
        return (
            <ScrollView style={styles.scrollView} onLayout={this.onLayout} >
                <View style={styles.mainContainer}>
                    <View style={styles.logoContainer}>
                        {this.renderImage(styles)}
                    </View>
                    <View style={styles.buttonsContainer}>
                        {this.renderButtons(styles)}
                    </View>
                </View>
                <AuthorizationErrorAlert />
            </ScrollView>);
    }

    renderImage(styles) {
        const { asyncOperationIsOngoing, asyncOngoingAuthWith } = this.props;

        if (asyncOperationIsOngoing && !asyncOngoingAuthWith)
            return (
                <>
                    <Spinner style={styles.spinner} />
                    <Text style={styles.logoText}>Please wait...</Text>
                </>
            );
        else
            return (
                <>
                    <Image source={require('../../resources/images/logo-twitch.png')} style={styles.logo} />
                    <Text style={styles.logoText}>Poor man's twitch</Text>
                </>
            );
    }

    renderButtons(styles) {
        const { isSignedIn, isSignedInWith } = this.props;

        if (!isSignedIn)
            return (
                <>
                    <GoogleButton style={styles.button} />
                    <FacebookButton style={styles.button} />
                    <GuestButton style={styles.button} />
                </>
            );
        else if (isSignedInWith === 'Google')
            return (
                <GoogleButton style={styles.button} />
            );
        else
            return (
                <FacebookButton style={styles.button} />
            );

    }
});