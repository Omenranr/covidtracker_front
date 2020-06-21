import axios from 'axios'
import { 
    NEWS_LOADED, 
} from "./types";

export const getPopularNews = (query) => (dispatch, getState) => {
    axios.get("https://ctnewsback.herokuapp.com/news/byCountry?"+query)
    .then(result => {
        console.log(result.data)
        let articles = result.data.articles.filter(ar => ar.urlToImage !== null)
        dispatch({type: NEWS_LOADED, payload: articles})
    })
}