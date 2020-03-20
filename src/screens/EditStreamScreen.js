import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    updateStream,
    clearStreamsError
} from '../actions';
import StreamForm from '../components/StreamForm';

function mapStateToProps(state, ownProps) {
    const props = {
        ...state.authorization,
        asyncOperationIsOngoing: state.streams.asyncOperationIsOngoing,
        asyncOngoingOperationType: state.streams.asyncOngoingOperationType
    }

    props.stream = ownProps.navigation.getParam('stream', null);
    return props;
}

export default connect(mapStateToProps, {
    updateStream: updateStream,
    clearStreamsError: clearStreamsError
})(class EditStreamScreen extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.getFormInitialValues = this.getFormInitialValues.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }

    onSubmit(formValues) {
        if (this.isLoading()) return;

        const { id } = this.props.navigation.getParam('stream', null);
        this.props.updateStream(id, formValues.title, formValues.description);
    }

    render() {
        return <>
            <StreamForm
                formTitle={"Edit Stream"}
                initialValues={this.getFormInitialValues()}
                onSubmit={this.onSubmit}
                titleLabelText={"Edit title:"}
                descriptionLabelText={"Edit description:"}
                submitText={"Submit Changes"}
                loading={this.isLoading()} />
        </>
    }

    getFormInitialValues() {
        if (!this.props.stream)
            return null;
        else {
            const { stream } = this.props;
            return { title: stream.title, description: stream.description };
        }
    }

    isLoading() {
        return this.props.asyncOperationIsOngoing && this.props.asyncOngoingOperationType === 'UPDATE_STREAM';
    }
});