import StreamsService from '../utils/StreamsService'
import {
    ONGOING_STREAMS_OPERATION_STATE_CHANGE,
    CLEAR_STREAMS_ERROR,
    ON_FIREBASE_CRITICAL_SYNC_ERROR,
    REAL_TIME_UPDATE_ERROR,
    REAL_TIME_UPDATE,
    SUBSCRIBE_TO_STREAMS,
    UNSUBSCRIBE_FROM_STREAMS,
    CREATE_STREAM,
    FETCH_STREAMS,
    FETCH_STREAM,
    UPDATE_STREAM,
    DELETE_STREAM
} from './types';
import { navigateBack } from './navigationActionCreators'

import InternetConnectionServices from '../utils/InternetConnectionServices';

import NoNetworkReadError from '../errors/NoNetworkReadError';
import NoNetworkCommitError from '../errors/NoNetworkCommitError';
import FailedToCreateStreamError from '../errors/FailedToCreateStreamError';
import FailedToUpdateStreamError from '../errors/FailedToUpdateStreamError';
import FailedToDeleteStreamError from '../errors/FailedToDeleteStreamError';

export function clearStreamsError() {
    return {
        type: CLEAR_STREAMS_ERROR,
        payload: {
            error: null
        }
    }
}

export function onFirebaseCriticalSyncError() {
    return {
        type: ON_FIREBASE_CRITICAL_SYNC_ERROR,
        payload: {
            streams: {},
            asyncOperationIsOngoing: false,
            asyncOngoingOperationType: null,
            subscribed: false,
            noNetworkError: null,
            error: null
        }
    }
}

export function createStream(title, description) {
    return async (dispatch, getState) => {
        const uid = getState().authorization.uid;

        let stream = { title: title, description: description, userId: uid };
        let error, noNetworkError = null;

        await dispatch({
            type: ONGOING_STREAMS_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: true,
                asyncOngoingOperationType: CREATE_STREAM
            }
        });

        try {
            if (!await InternetConnectionServices.isConnected())
                noNetworkError = new NoNetworkCommitError();

            await StreamsService.createStream(stream);
        } catch (err) {
            error = new FailedToCreateStreamError(null, err);
            console.log(error);
        }

        await dispatch({
            type: CREATE_STREAM,
            payload: {
                noNetworkError: noNetworkError,
                error: error
            }
        });

        await dispatch({
            type: ONGOING_STREAMS_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: false,
                asyncOngoingOperationType: null
            }
        });

        await dispatch(navigateBack());
    };

}

export function subscribeToStreams() {
    return async (dispatch, getState) => {

        let error, noNetworkError = null;

        try {
            if (await InternetConnectionServices.isConnected())
                StreamsService.subscribeToStreams(async (streams) => {
                    await dispatch({
                        type: REAL_TIME_UPDATE,
                        payload: {
                            streams: streams
                        }
                    });
                }, async (error) => {
                    await dispatch({
                        type: REAL_TIME_UPDATE_ERROR,
                        payload: {
                            error: error
                        }
                    });
                });
            else {
                noNetworkError = new NoNetworkReadError();
                postponeStreamsSubscribctionTillConnectionReestablished(dispatch);
            }
        } catch (err) {
            console.log(err);
            error = err;
        }

        await dispatch({
            type: SUBSCRIBE_TO_STREAMS,
            payload: {
                subscribed: error ? getState().streams.subscribed : true,
                noNetworkError: noNetworkError,
                error: error
            }
        });
    };
}

export function unsubscribeFromStreams() {
    return async (dispatch, getState) => {
        let error;

        try {
            StreamsService.unsubscribeFromStreams();
        } catch (err) {
            console.log(err);
            error = err;
        }

        await dispatch({
            type: UNSUBSCRIBE_FROM_STREAMS,
            payload: {
                subscribed: error ? getState().streams.subscribed : true,
                noNetworkError: null,
                error: error
            }
        });
    }
}

export function fetchStreams() {
    return async (dispatch, getState) => {

        let streams = [];
        let error, noNetworkError;

        try {
            if (await InternetConnectionServices.isConnected())
                streams = await StreamsService.getStreams();
            else {
                noNetworkError = new NoNetworkReadError();
                postponeStreamsFetchTillConnectionReestablished(dispatch);
            }
        } catch (err) {
            console.log(err);
            error = err;
        }

        await dispatch({
            type: FETCH_STREAMS,
            payload: {
                streams: streams,
                noNetworkError: noNetworkError,
                error: error
            }
        });
    };
}

export function fetchStream(id) {
    return async (dispatch, getState) => {

        let stream, error;

        try {
            if (await InternetConnectionServices.isConnected())
                stream = await StreamsService.getStream(id);
            else {
                noNetworkError = new NoNetworkReadError();
                postponeStreamFetchTillConnectionReestablished(dispatch, id);
            }
        } catch (err) {
            console.log(err);
            error = err;
        }

        await dispatch({
            type: FETCH_STREAM,
            payload: {
                stream: stream,
                noNetworkError: null,
                error: error
            }
        });
    };
}

export function updateStream(id, title, description) {
    return async (dispatch, getState) => {
        const streamUpdate = { title: title, description: description };

        let error, noNetworkError;

        await dispatch({
            type: ONGOING_STREAMS_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: true,
                asyncOngoingOperationType: UPDATE_STREAM
            }
        });

        try {
            if (!await InternetConnectionServices.isConnected())
                noNetworkError = new NoNetworkCommitError();
            await StreamsService.updateStream(id, streamUpdate);
        } catch (err) {
            error = new FailedToUpdateStreamError(null, err);
            console.log(error);
        }

        await dispatch({
            type: UPDATE_STREAM,
            payload: {
                noNetworkError: noNetworkError,
                error: error
            }
        });

        await dispatch({
            type: ONGOING_STREAMS_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: false,
                asyncOngoingOperationType: null
            }
        });

        await dispatch(navigateBack(true));
    };
}

export function deleteStream(id) {
    return async (dispatch, getState) => {
        let error, noNetworkError;

        await dispatch({
            type: ONGOING_STREAMS_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: true,
                asyncOngoingOperationType: DELETE_STREAM
            }
        });

        try {
            if (!await InternetConnectionServices.isConnected())
                noNetworkError = new NoNetworkCommitError();

            await StreamsService.deleteStream(id);
        } catch (err) {
            error = new FailedToDeleteStreamError(null, err);
            console.log(error);
        }

        await dispatch({
            type: DELETE_STREAM,
            payload: {
                noNetworkError: noNetworkError,
                error: error
            }
        });

        await dispatch({
            type: ONGOING_STREAMS_OPERATION_STATE_CHANGE,
            payload: {
                asyncOperationIsOngoing: false,
                asyncOngoingOperationType: null
            }
        });
    };
}

function postponeStreamsSubscribctionTillConnectionReestablished(dispatch) {
    InternetConnectionServices.executeOnConnectionReestablished(async () => {
        await dispatch(subscribeToStreams());
    });
}

function postponeStreamsFetchTillConnectionReestablished(dispatch) {
    InternetConnectionServices.executeOnConnectionReestablished(async () => {
        await dispatch(fetchStreams());
    });
}

function postponeStreamFetchTillConnectionReestablished(dispatch, id) {
    InternetConnectionServices.executeOnConnectionReestablished(async () => {
        await dispatch(fetchStream(id));
    });
}