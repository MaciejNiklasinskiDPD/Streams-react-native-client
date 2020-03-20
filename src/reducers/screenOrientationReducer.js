import {
    SET_SCREEN_ORIENTATION
} from '../actions/types'

const initialState = {
    orientation: null
};

export default function navigationReducer(state = initialState, action) {

    switch (action.type) {
        case SET_SCREEN_ORIENTATION:
            return { orientation: action.payload.orientation };
        default: return state;
    }
}