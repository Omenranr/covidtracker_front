import {combineReducers} from 'redux'
import dashReducer from './dashReducer'
import newsReducer from './newsReducer'

export default combineReducers({
    dashData: dashReducer,
    news: newsReducer,
})