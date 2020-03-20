import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    ScrollView,
    View
} from 'react-native';
import { streamsIndexScreenStyle as styles } from '../styles';
import StreamsList from '../components/StreamsList';
import StreamsButton from '../components/StreamsButton';
import StreamsErrorAlert from '../components/StreamsErrorAlert';
import {
    navigateTo,
    clearStreamsError
} from '../actions';

function mapStateToProps(state) {
    return {
        ...state.authorization
    };
}

export default connect(mapStateToProps, {
    navigateTo: navigateTo,
    clearStreamsError: clearStreamsError
})(class StreamsIndexScreen extends Component {
    constructor(props) {
        super(props);

        this.renderCreateStreamButton = this.renderCreateStreamButton.bind(this);
    }

    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.contentContainer}>
                    <StreamsList />
                    {this.renderCreateStreamButton()}
                </View>
                <StreamsErrorAlert />
            </ScrollView>);
    }

    renderCreateStreamButton() {
        if (!this.props.isSignedIn) return null;

        const { navigateTo } = this.props;
        return (
            <StreamsButton title={"Create"} style={styles.createButton} onPress={() => {
                navigateTo({ id: 'CreateStream', props: null, title: 'Create new Stream' });
            }} />
        );
    }
});
