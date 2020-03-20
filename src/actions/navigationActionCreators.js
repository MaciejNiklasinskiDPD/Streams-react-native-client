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

import { BackHandler } from 'react-native';

import ObjectEqualityComparer from '../utils/ObjectEqualityComparer';

export function setNavigationMethod(navigationMethod) {
    return {
        type: SET_NAVIGATION_METHOD,
        payload: {
            navigate: navigationMethod
        }
    }
}


export function setHomeScreen(currentScreen) {
    return async (dispatch, getState) => {
        const { navigate } = getState().navigation;

        navigate(currentScreen.id, currentScreen.props);

        await dispatch({
            type: SET_HOME_SCREEN,
            payload: {
                showNavigateBack: false,
                showNavigateForward: false,
                currentScreen: currentScreen,
                backToScreens: [],
                forwardToScreens: []
            }
        });
    }
}

export function setShowNavigateBack(showNavigateBack) {
    return {
        type: SET_SHOW_NAVIGATE_BACK,
        payload: {
            showNavigateBack: showNavigateBack
        }
    }
}

export function setShowNavigateForward(showNavigateForward) {
    return {
        type: SET_SHOW_NAVIGATE_FORWARD,
        payload: {
            showNavigateForward: showNavigateForward
        }
    }
}


export function navigateBackHome() {
    return async (dispatch, getState) => {
        const state = getState().navigation;

        let { navigate, backToScreens, currentScreen } = state;

        if (backToScreens.length === 0)
            return;
        else if (ObjectEqualityComparer.deepCompare(backToScreens[0], currentScreen))
            return;
        else {

            navigate(backToScreens[0].id, backToScreens[0].props);

            await dispatch({
                type: NAVIGATE_BACK_HOME,
                payload: {
                    showNavigateBack: false,
                    showNavigateForward: false,
                    currentScreen: backToScreens[0],
                    backToScreens: [],
                    forwardToScreens: []
                }
            });
        }
    }
}

export function navigateBack(discardCurrentScreen = false) {
    return async (dispatch, getState) => {
        const state = getState().navigation;

        let { navigate, backToScreens, forwardToScreens, currentScreen } = state;
        let lastBackToScreen;

        if (backToScreens.length === 0)
            BackHandler.exitApp();
        else {
            lastBackToScreen = backToScreens[backToScreens.length - 1];

            backToScreens = backToScreens.slice(0, backToScreens.length - 1);
            if (!discardCurrentScreen)
                forwardToScreens = [currentScreen, ...forwardToScreens];
            else
                forwardToScreens = [];

            navigate(lastBackToScreen.id, lastBackToScreen.props);
        }

        await dispatch({
            type: NAVIGATE_BACK,
            payload: {
                showNavigateBack: backToScreens.length > 0 ? true : false,
                showNavigateForward: forwardToScreens.length > 0 ? true : false,
                currentScreen: lastBackToScreen,
                backToScreens: backToScreens,
                forwardToScreens: forwardToScreens
            }
        });
    }
}

export function navigateForward() {
    return async (dispatch, getState) => {
        const state = getState().navigation;

        let { navigate, backToScreens, forwardToScreens, currentScreen } = state;

        const firstForwardToScreen = forwardToScreens[0];

        backToScreens = [...backToScreens, currentScreen];
        forwardToScreens = forwardToScreens.slice(1);

        navigate(firstForwardToScreen.id, firstForwardToScreen.props);

        await dispatch({
            type: NAVIGATE_FORWARD,
            payload: {
                showNavigateBack: backToScreens.length > 0 ? true : false,
                showNavigateForward: forwardToScreens.length > 0 ? true : false,
                currentScreen: firstForwardToScreen,
                backToScreens: backToScreens,
                forwardToScreens: forwardToScreens
            }
        });
    }
}

export function navigateTo(screen) {
    return async (dispatch, getState) => {
        const state = getState().navigation;

        let { navigate, backToScreens, forwardToScreens, currentScreen } = state;

        const lastBackToScreen = backToScreens[backToScreens.length - 1];
        const firstForwardToScreen = forwardToScreens[0];

        if (ObjectEqualityComparer.deepCompare(screen, currentScreen))
            return;
        else if (ObjectEqualityComparer.deepCompare(screen, lastBackToScreen)) {
            backToScreens = backToScreens.slice(0, backToScreens.length - 1);
            forwardToScreens = [currentScreen, ...forwardToScreens];
        }
        else if (ObjectEqualityComparer.deepCompare(screen, firstForwardToScreen)) {
            backToScreens = [...backToScreens, currentScreen];
            forwardToScreens = forwardToScreens.slice(1);
        }
        else {
            backToScreens = [...backToScreens, currentScreen];
            forwardToScreens = [];
        }

        navigate(screen.id, screen.props);

        await dispatch({
            type: NAVIGATE_TO,
            payload: {
                showNavigateBack: backToScreens.length > 0 ? true : false,
                showNavigateForward: forwardToScreens.length > 0 ? true : false,
                currentScreen: screen,
                backToScreens: backToScreens,
                forwardToScreens: forwardToScreens
            }
        });
    }
}