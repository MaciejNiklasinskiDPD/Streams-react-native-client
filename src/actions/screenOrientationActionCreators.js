import { SET_SCREEN_ORIENTATION } from './types'


export function setScreenOrientation(orientation) {
    return {
        type: SET_SCREEN_ORIENTATION,
        payload: {
            orientation: orientation
        }
    }
}