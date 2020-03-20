import React, { Component } from 'react';
import { Animated, View, Easing } from 'react-native';

export default class Spinner extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spinValue: new Animated.Value(0)
        }
    }

    render() {
        // First set up animation 
        Animated.loop(
            Animated.timing(
                this.state.spinValue,
                {
                    toValue: 1,
                    duration: 25000,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ).start();

        // Second interpolate beginning and end values (in this case 0 and 1)
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 360]
        });

        return (
            <Animated.Image
                style={{
                    ...this.props.style,
                    transform: [{ rotate: spin }]
                }}
                resizeMode={this.props.resizeMode}
                source={require('../../resources/images/loading.png')} />
        );
    }
}