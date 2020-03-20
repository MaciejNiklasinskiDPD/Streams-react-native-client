import React, { Component } from 'react';
import {
    View,
    Text,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import { streamsListItemStyle as styles } from '../styles';
import {
    navigateTo,
    deleteStream
} from '../actions'

import StreamsButton from './StreamsButton';

function mapStateToProps(state) {
    return { ...state.authorization };
}

export default connect(mapStateToProps, {
    navigateTo: navigateTo,
    deleteStream: deleteStream
})(
    class StreamsListItem extends Component {
        constructor(props) {
            super(props);

            this.renderStreamOwnerButtons = this.renderStreamOwnerButtons.bind(this);
        }

        render() {
            const { stream, navigateTo } = this.props;
            return (
                <View style={styles.mainContainer}>
                    <Text style={styles.title}>{stream.title}</Text>
                    <Text style={styles.description}>{stream.description}</Text>
                    <View style={styles.buttonsContainer}>
                        <StreamsButton style={styles.showButton} title={"Show"} onPress={() => { navigateTo({ id: 'ShowStream', props: { stream: stream }, title: stream.title }) }} />
                        {this.renderStreamOwnerButtons()}
                    </View>
                </View>
            );
        }

        renderStreamOwnerButtons() {
            const { stream, isSignedIn, uid, navigateTo, deleteStream } = this.props;

            if (isSignedIn && stream.userId === uid)
                return (
                    <>
                        <StreamsButton style={styles.editButton} title={"Edit"} onPress={() => { navigateTo({ id: 'EditStream', props: { stream: stream }, title: stream.title }) }} />
                        <StreamsButton style={styles.deleteButton} title={"Delete"} onPress={() => {
                            Alert.alert(
                                'Delete stream',
                                `Are you sure you want to delete "${stream.title}" stream?`,
                                [
                                    { text: 'No', onPress: () => { } },
                                    { text: 'Yes', onPress: () => { deleteStream(stream.id); } },
                                ],
                                { cancelable: false },
                            );
                        }} />
                    </>
                );
            else
                return (
                    <>
                        <Text> </Text>
                        <Text> </Text>
                    </>
                );
        }
    });