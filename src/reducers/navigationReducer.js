import {
    SET_NAVIGATION_METHOD,
    SET_HOME_SCREEN,
    SET_SHOW_NAVIGATE_BACK,
    SET_SHOW_NAVIGATE_FORWARD,
    NAVIGATE_BACK_HOME,
    NAVIGATE_BACK,
    NAVIGATE_FORWARD,
    NAVIGATE_TO
} from '../actions/types'

const initialState = {
    navigate: () => { throw new Error('No navigation method has been set yet. Call setNavigationMethod() action creator before using navigationReducer.getState().navigate().') },
    showNavigateBack: false,
    showNavigateForward: false,
    currentScreen: null,
    backToScreens: [],
    forwardToScreens: []
}

export default function navigationReducer(state = initialState, action) {
    switch (action.type) {
        case SET_NAVIGATION_METHOD:
            return {
                ...state,
                navigate: action.payload.navigate
            }
        case SET_SHOW_NAVIGATE_BACK:
            return {
                ...state,
                showNavigateBack: action.payload.showNavigateBack
            }
        case SET_SHOW_NAVIGATE_FORWARD:
            return {
                ...state,
                showNavigateForward: action.payload.showNavigateForward
            }
        case SET_HOME_SCREEN:
        case NAVIGATE_BACK_HOME:
        case NAVIGATE_BACK:
        case NAVIGATE_FORWARD:
        case NAVIGATE_TO:
            return {
                ...state,
                backToScreens: action.payload.backToScreens,
                forwardToScreens: action.payload.forwardToScreens,
                currentScreen: action.payload.currentScreen,
                showNavigateBack: action.payload.showNavigateBack,
                showNavigateForward: action.payload.showNavigateForward
            }
        default: return state;
    }
}