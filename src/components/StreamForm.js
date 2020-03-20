import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    View,
    Text,
    TextInput
} from 'react-native';
import { getStreamFormStyle as getStyles } from '../styles'
import StreamsButton from './StreamsButton';


function mapStateToProps(state) {
    return { ...state.screenOrientation };
}

export default connect(mapStateToProps)(
    class StreamForm extends Component {
        constructor(props) {
            super(props);

            this.renderTextInputField = this.renderTextInputField.bind(this);
            this.renderTextInputFieldError = this.renderTextInputFieldError.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.validate = this.validate.bind(this);
            this.validateAll = this.validateAll.bind(this);

            this.state = {
                title: '',
                titleTouched: false,
                titleError: null,
                description: '',
                descriptionTouched: false,
                descriptionError: null,
            }
        }

        componentDidMount() {
            if (this.props.initialValues)
                this.setState({ title: this.props.initialValues.title, description: this.props.initialValues.description });
        }

        render() {
            const styles = getStyles();
            return (
                <View style={styles.mainContainer}>
                    <Text style={styles.title}>{this.props.formTitle}</Text>
                    {this.renderTextInputField('title', this.props.titleLabelText, styles)}
                    {this.renderTextInputField('description', this.props.descriptionLabelText, styles)}
                    <View style={styles.buttonContainer}>
                        <StreamsButton
                            style={styles.submitButton}
                            loading={this.props.loading}
                            title="Submit"
                            onPress={() => {
                                if (!this.validateAll()) return;
                                this.props.onSubmit({ title: this.state.title, description: this.state.description })
                            }}>{this.props.submitText}</StreamsButton>
                    </View>
                </View >
            );
        }

        renderTextInputField(name, label, styles) {

            const touched = this.state[`${name}Touched`];
            const error = this.state[`${name}Error`];

            return <View style={styles.inputFieldContainer}>
                <Text style={styles.inputFieldTitle}>{label}</Text>
                <TextInput
                    style={styles.inputFieldInput}
                    autoComplete={"off"}
                    onChangeText={(value) => {

                        const newStateValue = {};
                        newStateValue[name] = value;

                        this.setState(newStateValue);
                    }}
                    onBlur={() => { this.validate(name) }}
                    onFocus={() => {
                        if (!touched) {
                            const newState = {};
                            newState[`${name}Touched`] = true;
                            this.setState(newState);
                        }
                        if (error) {
                            const newState = {};
                            newState[`${name}Error`] = null;
                            this.setState(newState);
                        }
                    }}
                    value={this.state[name]}
                />
                {error ? this.renderTextInputFieldError(error, styles) : null}
            </View>;
        }

        renderTextInputFieldError(error, styles) {
            return <Text style={styles.inputFieldError}>{error}</Text>;
        }

        validateAll() {
            let validationPassed = true;

            if (!this.validate('title')) validationPassed = false;
            if (!this.validate('description')) validationPassed = false;

            return validationPassed;
        }

        validate(name) {
            if (this.state[name]) return true;

            if (name === 'title')
                this.setState({ titleError: "Title must not be empty" });
            else
                this.setState({ descriptionError: "Description must not be empty" });

            return false;
        }
    }
);