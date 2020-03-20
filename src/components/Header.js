import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    Platform
} from 'react-native';
import { getHeaderStyle as getStyles } from '../styles';
import HeaderButton from './HeaderButton';


function mapStateToProps(state) {
    return { ...state.navigation, ...state.screenOrientation };
}

export default connect(mapStateToProps)(
    class Header extends Component {
        constructor(props) {
            super(props);

        }

        render() {
            const styles = getStyles();
            let mainContainerStyle = null;

            if (this.props.orientation !== 'horizontal' || Platform.OS === 'ios' || (this.props.currentScreen && this.props.currentScreen.id !== "ShowStream"))
                mainContainerStyle = styles.mainContainer;
            else
                mainContainerStyle = styles.mainContainerHidden;

            return (
                <View style={mainContainerStyle} onLayout={this.onLayout}>
                    <View style={styles.backButtonContainer}><HeaderButton title='Back' navigateMode={'Back'} imageAppendsText={true} image={require('../../resources/images/chevron-back.png')} /></View>
                    <Text style={styles.text}>{this.props.currentScreen ? this.props.currentScreen.title : null}</Text>
                    <View style={styles.forwardButtonContainer}><HeaderButton title='Forward' navigateMode={'Forward'} image={require('../../resources/images/chevron-forward.png')} /></View>
                </View>
            );
        }
    }
);