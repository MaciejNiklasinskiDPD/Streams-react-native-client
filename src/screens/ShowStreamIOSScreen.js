import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import { showStreamIOSScreenStyle as styles } from '../styles';
import StreamPlayer from '../components/StreamPlayer';

function mapStateToProps(state, ownProps) {
    const props = { ...state.authorization }

    props.stream = ownProps.navigation.getParam('stream', null);

    return props;
}

export default connect(mapStateToProps)(
    class ShowStreamIOSScreen extends Component {
        constructor(props) {
            super(props);

            this.renderStreamDetails = this.renderStreamDetails.bind(this);
            this.renderStreamKey = this.renderStreamKey.bind(this);
        }

        render() {
            return (
                <View style={styles.mainContainer}>
                    <View style={styles.contentContainer}>
                        <View style={styles.playerContainer}><StreamPlayer stream={this.props.stream} /></View>
                        {this.renderStreamDetails(styles)}
                        {this.renderStreamKey(styles)}
                    </View >
                </View >
            );
        }
        renderStreamDetails(styles) {
            return (
                <>
                    <Text style={styles.title}>{this.props.stream.title}</Text>
                    <Text style={styles.description}>{this.props.stream.description}</Text>
                </>);
        }

        renderStreamKey(styles) {
            if (!this.props.stream || this.props.uid !== this.props.stream.userId)
                return null;
            else
                return <Text style={styles.id}>Stream key: {this.props.stream.id}</Text>;
        }
    });