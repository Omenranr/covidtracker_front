import { 
    CURRENT_LOADED,
    TOTAL_LOADED,
} from '../actions/types'

const initialState = {
    currentData: [],
    totalData: {},
}

export default function(state=initialState, action) {
    switch(action.type) {
        case CURRENT_LOADED:
            return {
                ...state,
                currentData: action.payload
            }
        case TOTAL_LOADED:
            return {
                ...state,
                totalData: action.payload
            }
        default:
            return state
    }
}