import axios from 'axios'
import { 
    CURRENT_LOADED, 
    TOTAL_LOADED,
    HISTORICAL_LOADED,
    COUNTRIES_LOADED,
    COUNTRY_LOADED,
    COUNTRY_PREDICTION,
    COUNTRY_METRIC,
} from "./types";

export const getCurrentData = () => (dispatch, getState) => {
    axios.get("https://disease.sh/v2/countries?sort=cases&allowNull=false")
    .then(result => {
        console.log("current data", result.data)
        dispatch({type: CURRENT_LOADED, payload: result.data})
    })
}

export const getTotalData = () => (dispatch, getState) => {
    axios.get("https://disease.sh/v2/all?allowNull=false")
    .then(result => {
        console.log("total data", result.data)
        dispatch({type: TOTAL_LOADED, payload: result.data})
    })
}

export const getHistorical = () => (dispatch, getState) => {
    axios.get("https://disease.sh/v2/historical?lastdays=all")
    .then(result => {
        console.log("all historical", result.data)
        dispatch({type: HISTORICAL_LOADED, payload: result.data})
    })
}

export const getCountryHistorical = (country) => (dispatch, getState) => {
    axios.get("https://disease.sh/v2/historical/"+country+"?lastdays=all")
    .then(result => {
        console.log("country historical", result.data)
        dispatch({type: COUNTRY_LOADED, payload: result.data})
    })
}

export const getCountriesHistorical = (countries) => (dispatch, getState) => {
    axios.get("https://disease.sh/v2/historical/"+countries+"?lastdays=all")
    .then(result => {
        console.log("countries historical", result.data)
        dispatch({type: COUNTRIES_LOADED, payload: result.data})
    })
}

export const getCountryPrediction = (countryCode) => (dispatch, getState) => {
    axios.get("http://springboot-cov19-api.herokuapp.com/api/prediction/"+countryCode, {headers:{'Access-Control-Allow-Origin': "*"}})
    .then(result => {
        console.log("country prediction", result.data)
        dispatch({type: COUNTRY_PREDICTION, payload: result.data})
    })
}

export const getMetricPrediction = (countryCode) => (dispatch, getState) => {
    axios.get("http://springboot-cov19-api.herokuapp.com/api/metric/"+countryCode, {headers:{'Access-Control-Allow-Origin': "*"}})
    .then(result => {
        console.log("country metric prediction", result.data.statusList)
        dispatch({type: COUNTRY_METRIC, payload: result.data.statusList})
    })
}