import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Alert,
} from 'react-native';
import {
    clearAuthorizationError,
    tryInitialize,
    trySignInWithGoogle,
    trySignInWithFacebook,
    trySignOut
} from '../actions';

import AuthorizationInitializationFailedDueToNoNetworkError from '../errors/AuthorizationInitializationFailedDueToNoNetworkError';
import UnableToSignInDueToNoNetworkError from '../errors/UnableToSignInDueToNoNetworkError';
import UnableToSignOutDueToNoNetworkError from '../errors/UnableToSignOutDueToNoNetworkError';
import FirebaseCriticalSyncError from '../errors/FirebaseCriticalSyncError';

function mapStateToProps(state) {
    return { error: state.authorization.error };
}

export default connect(mapStateToProps, {
    clearAuthorizationError: clearAuthorizationError,
    tryInitialize: tryInitialize,
    trySignInWithGoogle: trySignInWithGoogle,
    trySignInWithFacebook: trySignInWithFacebook,
    trySignOut: trySignOut
})(class AuthorizationErrorAlert extends Component {
    constructor(props) {
        super(props);

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentDidUpdate() {
        if (!this.props.error)
            return;
        else if (this.props.error instanceof AuthorizationInitializationFailedDueToNoNetworkError)
            Alert.alert(
                'No internet connection.',
                `Unable to initialize authentication service. This is most likely due to internet connection not being available. Application will work in offline mode till internet connection will be reestablished.`,
                [{ text: 'Ok', onPress: () => { } }],
                { cancelable: false },
            );
        else if (this.props.error instanceof UnableToSignInDueToNoNetworkError) {
            const { oAuth2Provider } = this.props.error;
            Alert.alert(
                'No internet connection.',
                `Unable to sign in. This is most likely due to internet connection not being available.`,
                [
                    { text: 'Cancel', onPress: () => { } },
                    {
                        text: 'Retry', onPress: () => {
                            if (oAuth2Provider === 'Google')
                                this.props.trySignInWithGoogle();
                            else
                                this.props.trySignInWithFacebook();
                        }
                    }
                ],
                { cancelable: false },
            );
        }
        else if (this.props.error instanceof UnableToSignOutDueToNoNetworkError)
            Alert.alert(
                'No internet connection.',
                `Unable to sign out. This is most likely due to internet connection not being available.`,
                [
                    { text: 'Cancel', onPress: () => { } },
                    {
                        text: 'Retry', onPress: () => {

                            this.props.trySignOut();
                        }
                    }
                ],
                { cancelable: false },
            );
        else if (this.props.error instanceof FirebaseCriticalSyncError) {
            const isRecoverable = !this.props.error.firebaseTerminationError ? true : false;
            Alert.alert(
                'Firebase synchronization error.',
                `Application failed to synchronize the changes committed when no internet connection was available with the online database. Some changes could be lost.`,
                [
                    {
                        text: 'Reconnect', onPress: () => {

                            this.props.tryInitialize();
                        }
                    }
                ],
                { cancelable: false },
            );
        }
        else
            Alert.alert(
                'Unexpected error.',
                `Application encountered unexpected error.`,
                [
                    { text: 'Ok', onPress: () => { } }
                ],
                { cancelable: false },
            );

        this.props.clearAuthorizationError();
    }

    render() {
        return <></>;
    }
});