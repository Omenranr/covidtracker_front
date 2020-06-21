import { 
    NEWS_LOADED,
} from '../actions/types'

const initialState = {
    articles: []
}

export default function(state=initialState, action) {
    switch(action.type) {
        case NEWS_LOADED:
            return {
                ...state,
                articles: action.payload
            }
        default:
            return state
    }
}