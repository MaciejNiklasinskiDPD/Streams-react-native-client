import React, { Component } from 'react';
import StreamForm from '../components/StreamForm';
import { connect } from 'react-redux';
import {
    createStream,
    clearStreamsError
} from '../actions';

function mapStateToProps(state) {
    return {
        asyncOperationIsOngoing: state.streams.asyncOperationIsOngoing,
        asyncOngoingOperationType: state.streams.asyncOngoingOperationType
    };
}

export default connect(mapStateToProps, {
    createStream: createStream,
    clearStreamsError: clearStreamsError
})(class CreateStreamScreen extends Component {
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.isLoading = this.isLoading.bind(this);
    }

    onSubmit(formValues) {
        if (this.isLoading()) return;

        this.props.createStream(formValues.title, formValues.description);
    }

    render() {
        return <>
            <StreamForm
                formTitle={"Create Stream"}
                onSubmit={this.onSubmit}
                titleLabelText={"Enter title:"}
                descriptionLabelText={"Enter description:"}
                submitText={"Submit"}
                loading={this.isLoading()} />
        </>
    }

    isLoading() {
        return this.props.asyncOperationIsOngoing && this.props.asyncOngoingOperationType === 'CREATE_STREAM';
    }
});