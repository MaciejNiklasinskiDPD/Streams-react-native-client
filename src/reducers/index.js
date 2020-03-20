import { combineReducers } from 'redux';
import authorizationReducer from './authorizationReducer';
import streamsReducer from './streamsReducer';
import navigationReducer from './navigationReducer';
import screenOrientationReducer from './screenOrientationReducer';

export default combineReducers({
    streams: streamsReducer,
    authorization: authorizationReducer,
    navigation: navigationReducer,
    screenOrientation: screenOrientationReducer
});