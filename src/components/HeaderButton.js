import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Image,
    Text
} from 'react-native';
import { headerButtonStyle as styles } from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    navigateBack,
    navigateForward
} from '../actions';


function mapStateToProps(state) {
    return { ...state.authorization, ...state.navigation };
}

export default connect(mapStateToProps, {
    navigateBack: navigateBack,
    navigateForward: navigateForward
})(
    class HeaderButton extends Component {
        constructor(props) {
            super(props);

            this.onPress = this.onPress.bind(this);
            this.renderBody = this.renderBody.bind(this);
        }

        onPress() {
            const { navigateMode } = this.props;

            if (navigateMode === 'Forward')
                this.props.navigateForward();
            else
                this.props.navigateBack();
        }

        render() {
            const { showNavigateBack, showNavigateForward, asyncOperationIsOngoing } = this.props;
            if (asyncOperationIsOngoing) return null;
            else if (this.props.navigateMode === 'Forward' && !showNavigateForward) return <Text> </Text>;
            else if (this.props.navigateMode !== 'Forward' && !showNavigateBack) return <Text> </Text>;

            return (
                <TouchableOpacity style={styles.touchableOpacity} onPress={this.onPress}>
                    {this.renderBody()}
                </TouchableOpacity>
            );
        }

        renderBody() {
            if (this.props.imageAppendsText)
                return <><Image style={styles.image} source={this.props.image} /><Text style={styles.text}>{this.props.title}</Text></>
            else
                return <><Text style={styles.text}>{this.props.title}</Text><Image style={styles.image} source={this.props.image} /></>
        }
    }
);