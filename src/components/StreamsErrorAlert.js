import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Alert,
} from 'react-native';
import {
    clearStreamsError
} from '../actions';

import FailedToCreateStreamError from '../errors/FailedToCreateStreamError';
import FailedToUpdateStreamError from '../errors/FailedToUpdateStreamError';
import FailedToDeleteStreamError from '../errors/FailedToDeleteStreamError';
import NoNetworkCommitError from '../errors/NoNetworkCommitError';
import NoNetworkReadError from '../errors/NoNetworkReadError';

function mapStateToProps(state) {
    return {
        error: state.streams.error,
        noNetworkError: state.streams.noNetworkError
    };
}

export default connect(mapStateToProps, {
    clearStreamsError: clearStreamsError
})(class StreamsErrorAlert extends Component {
    constructor(props) {
        super(props);

        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentDidUpdate() {
        if (!this.props.error && !this.props.noNetworkError)
            return null;

        if (this.props.noNetworkError instanceof NoNetworkReadError)
            Alert.alert(
                'No internet connection',
                `There is not internet connection at this time. Application will work in offline mode till connection will be reestablished. Any requested data will be retrieved as soon as internet connection will be available.`,
                [
                    { text: 'Ok', onPress: () => { } }
                ],
                { cancelable: false },
            );
        else if (this.props.noNetworkError instanceof NoNetworkCommitError)
            Alert.alert(
                'No internet connection',
                `There is not internet connection at this time. Application will work in offline mode till connection will be reestablished. Any changes committed will be stored on local device and synchronized with cloud service as soon as internet connection will be available.`,
                [
                    { text: 'Ok', onPress: () => { } }
                ],
                { cancelable: false },
            );

        if (this.props.error instanceof FailedToCreateStreamError)
            Alert.alert(
                'Create stream error',
                `Failed to create new stream.`,
                [
                    { text: 'Ok', onPress: () => { } }
                ],
                { cancelable: false },
            );
        else if (this.props.error instanceof FailedToUpdateStreamError)
            Alert.alert(
                'Update stream error',
                `Failed to update existing stream.`,
                [
                    { text: 'Ok', onPress: () => { } }
                ],
                { cancelable: false },
            );
        else if (this.props.error instanceof FailedToDeleteStreamError)
            Alert.alert(
                'Delete stream error',
                `Failed to delete existing stream.`,
                [
                    { text: 'Ok', onPress: () => { } }
                ],
                { cancelable: false },
            );
        else if (this.props.error)
            Alert.alert(
                'Unexpected error.',
                `Application encountered unexpected error.`,
                [
                    { text: 'Ok', onPress: () => { } }
                ],
                { cancelable: false },
            );

        this.props.clearStreamsError();
    }

    render() {
        return <></>;
    }
});