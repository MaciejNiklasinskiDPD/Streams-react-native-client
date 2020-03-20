import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import { getShowStreamScreenStyle as getStyles } from '../styles';
import StreamPlayer from '../components/StreamPlayer';

function mapStateToProps(state, ownProps) {
    const props = { ...state.authorization, ...state.screenOrientation }

    props.stream = ownProps.navigation.getParam('stream', null);

    return props;
}

export default connect(mapStateToProps)(
    class ShowStreamScreen extends Component {
        constructor(props) {
            super(props);

            this.renderStreamDetails = this.renderStreamDetails.bind(this);
            this.renderStreamKey = this.renderStreamKey.bind(this);
        }

        render() {
            const styles = getStyles();
            return (
                <View style={this.props.orientation !== 'vertical' ? styles.mainContainerHorizontal : styles.mainContainerVertical}>
                    <View style={this.props.orientation !== 'vertical' ? styles.playerContainerHorizontal : styles.playerContainerVertical}><StreamPlayer stream={this.props.stream} /></View>
                    {this.renderStreamDetails(styles)}
                    {this.renderStreamKey(styles)}
                </View >
            );
        }
        renderStreamDetails(styles) {
            if (this.props.orientation !== 'vertical')
                return null;
            else
                return (
                    <>
                        <Text style={styles.title}>{this.props.stream.title}</Text>
                        <Text style={styles.description}>{this.props.stream.description}</Text>
                    </>);
        }

        renderStreamKey(styles) {
            if (!this.props.stream || this.props.uid !== this.props.stream.userId || this.props.orientation !== 'vertical')
                return null;
            else
                return <Text style={styles.id}>Stream key: {this.props.stream.id}</Text>;
        }
    });