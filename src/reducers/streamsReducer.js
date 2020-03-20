import {
    ONGOING_STREAMS_OPERATION_STATE_CHANGE,
    CLEAR_STREAMS_ERROR,
    ON_FIREBASE_CRITICAL_SYNC_ERROR,
    REAL_TIME_UPDATE_ERROR,
    REAL_TIME_UPDATE,
    SUBSCRIBE_TO_STREAMS,
    UNSUBSCRIBE_FROM_STREAMS,
    FETCH_STREAMS,
    CREATE_STREAM,
    FETCH_STREAM,
    UPDATE_STREAM,
    DELETE_STREAM
} from '../actions/types'

const initialState = {
    streams: {},
    asyncOperationIsOngoing: false,
    asyncOngoingOperationType: null,
    subscribed: false,
    noNetworkError: null,
    error: null
}

export default function streamsReducer(state = initialState, action) {
    switch (action.type) {
        case ONGOING_STREAMS_OPERATION_STATE_CHANGE:
            return {
                ...state,
                asyncOperationIsOngoing: action.payload.asyncOperationIsOngoing,
                asyncOngoingOperationType: action.payload.asyncOngoingOperationType
            };
        case CLEAR_STREAMS_ERROR:
            return {
                ...state,
                noNetworkError: action.payload.noNetworkError,
                error: action.payload.error
            };
        case ON_FIREBASE_CRITICAL_SYNC_ERROR:
            return action.payload;
        case REAL_TIME_UPDATE_ERROR:
            return {
                ...state,
                error: action.payload.error
            };
        case REAL_TIME_UPDATE: {
            const newState = { ...state, streams: {} };

            action.payload.streams.forEach((stream) => {
                newState.streams[stream.id] = stream;
            });

            return newState;
        }
        case SUBSCRIBE_TO_STREAMS:
        case UNSUBSCRIBE_FROM_STREAMS:
            return {
                ...state,
                subscribed: action.payload.subscribed,
                noNetworkError: action.payload.noNetworkError,
                error: action.payload.error
            };
        case FETCH_STREAMS: {
            const { error, noNetworkError, streams } = action.payload;

            // If error, or noNetworkError occurred ..
            if (error || noNetworkError)
                // .. return copy of existing sate overriding only error related fields.
                return { ...state, noNetworkError: noNetworkError, error: error };

            // Otherwise if no error occurred, replace content of streams library object
            // with content of returned payload streams array.
            const newState = { ...state, noNetworkError: noNetworkError, streams: {} };

            streams.forEach((stream) => {
                newState.streams[stream.id] = stream;
            });

            return newState;
        }
        case FETCH_STREAM: {

            const { stream, error, noNetworkError } = action.payload;

            // If error, or noNetworkError occurred ..
            if (error || noNetworkError)
                // .. return copy of existing sate overriding only error related fields.
                return { ...state, noNetworkError: noNetworkError, error: error };

            // Otherwise if no error occurred, add returned payload stream to the streams library object.
            const newState = { ...state, noNetworkError: noNetworkError, streams: { ...state.streams } };
            newState.streams[stream.id] = stream;

            return newState;
        }
        case CREATE_STREAM:
        case UPDATE_STREAM:
        case DELETE_STREAM: {

            const { error, noNetworkError } = action.payload;

            if (error)
                return { ...state, noNetworkError: noNetworkError, error: error };
            else
                return { ...state, noNetworkError: noNetworkError };
        }
        default: return state;
    }
}