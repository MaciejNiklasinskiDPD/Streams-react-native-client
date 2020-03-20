import React, { Component } from 'react'; import {
    View
} from 'react-native';
import { connect } from 'react-redux';
import {
    subscribeToStreams
} from '../actions';
import StreamsListItem from './StreamsListItem';


function mapStateToProps(state) {
    return {
        streams: Object.values(state.streams.streams),
        subscribed: state.streams.subscribed,
        error: state.streams.error
    };
}
export default connect(mapStateToProps, {
    subscribeToStreams: subscribeToStreams
})(class StreamsList extends Component {
    constructor(props) {
        super(props);

        this.componentDidMount = this.componentDidMount.bind(this);
        this.renderStreams = this.renderStreams.bind(this);
    }

    componentDidMount() {
        if (!this.props.subscribed)
            this.props.subscribeToStreams();
    }

    render() {
        return <View>
            {this.renderStreams()}
        </View>
    }

    renderStreams() {
        if (!this.props.streams)
            return null;
        else
            return this.props.streams.map((stream) => {
                return <StreamsListItem key={stream.id} stream={stream} />;
            });
    }
});
