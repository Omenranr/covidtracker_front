import axios from 'axios'
import { 
    CURRENT_LOADED, 
    TOTAL_LOADED,
} from "./types";

export const getCurrentData = () => (dispatch, getState) => {
    axios.get("https://disease.sh/v2/countries?sort=cases&allowNull=false")
    .then(result => {
        console.log(result.data)
        dispatch({type: CURRENT_LOADED, payload: result.data})
    })
}

export const getTotalData = () => (dispatch, getState) => {
    axios.get("https://disease.sh/v2/all?allowNull=false")
    .then(result => {
        console.log(result.data)
        dispatch({type: TOTAL_LOADED, payload: result.data})
    })
}