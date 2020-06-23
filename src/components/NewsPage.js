import React, { useState, useEffect } from 'react'
import { CarService } from '../service/CarService'
import { Panel } from 'primereact/panel'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Chart } from 'primereact/chart'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { FullCalendar } from 'primereact/fullcalendar'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { CoronaDataTable } from "./CoronaDataTable"
import { AutoComplete } from 'primereact/autocomplete'
//actions functions & redux imports
import { getPopularNews } from "../actions/newsActions"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import NewsCard from './NewsCard'
import countriesData from '../countries.json'

const NewsPage = (props) => {
    const {news, getPopularNews} = props
    const [filteredCountries, setFilteredCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [newsState, setNewsState] = useState([])
    const [error, setError] = useState(null)
    const countries = countriesData
    const countriesNames = ["USA", "Brazil", "Russia", "India", "UK", "Spain", "Peru", "Italy", "Chile", "Iran", "Germany", "Turkey", "Pakistan", "Mexico", "France", "Saudi Arabia", "Bangladesh", "Canada", "South Africa", "Qatar", "China", "Colombia", "Belgium", "Belarus", "Sweden", "Egypt", "Ecuador", "Netherlands", "Indonesia", "UAE", "Singapore", "Argentina", "Kuwait", "Portugal", "Ukraine", "Poland", "Switzerland", "Philippines", "Iraq", "Oman", "Afghanistan", "Dominican Republic", "Ireland", "Panama", "Romania", "Bolivia", "Bahrain", "Israel", "Nigeria", "Armenia", "Japan", "Austria", "Kazakhstan", "Moldova", "Ghana", "Serbia", "Guatemala", "Denmark", "S. Korea", "Azerbaijan", "Algeria", "Honduras", "Cameroon", "Czechia", "Morocco", "Norway", "Nepal", "Malaysia", "Sudan", "Australia", "Côte d'Ivoire", "Finland", "Uzbekistan", "Senegal", "DRC", "Tajikistan", "Macedonia", "Haiti", "Guinea", "Djibouti", "Kenya", "El Salvador", "Ethiopia", "Gabon", "Luxembourg", "Hungary", "Bulgaria", "Venezuela", "Bosnia", "Greece", "Thailand", "Kyrgyzstan", "Mauritania", "Somalia", "Central African Republic", "Mayotte", "Cuba", "Croatia", "Maldives", "French Guiana", "Costa Rica", "Estonia", "Sri Lanka", "Mali", "Albania", "South Sudan", "Nicaragua", "Iceland", "Lithuania", "Equatorial Guinea", "Slovakia", "Guinea-Bissau", "Lebanon", "Slovenia", "New Zealand", "Madagascar", "Zambia", "Paraguay", "Sierra Leone", "Tunisia", "Hong Kong", "Latvia", "Niger", "Jordan", "Cyprus", "Yemen", "Burkina Faso", "Georgia", "Congo", "Cabo Verde", "Chad", "Andorra", "Uruguay", "Palestine", "Uganda", "Diamond Princess", "Rwanda", "San Marino", "Sao Tome and Principe", "Mozambique", "Malta", "Jamaica", "Benin", "Swaziland", "Malawi", "Liberia", "Channel Islands", "Togo", "Libyan Arab Jamahiriya", "Tanzania", "Réunion", "Zimbabwe", "Taiwan", "Montenegro", "Vietnam", "Mauritius", "Isle of Man", "Suriname", "Myanmar", "Comoros", "Martinique", "Mongolia", "Syrian Arab Republic", "Cayman Islands", "Faroe Islands", "Guyana", "Angola", "Gibraltar", "Guadeloupe", "Bermuda", "Eritrea", "Brunei", "Cambodia", "Trinidad and Tobago", "Bahamas", "Burundi", "Aruba", "Monaco", "Barbados", "Botswana", "Liechtenstein", "Sint Maarten", "Bhutan", "French Polynesia", "Namibia", "Macao", "Saint Martin", "Gambia", "Saint Vincent and the Grenadines", "Antigua and Barbuda", "Timor-Leste", "Curaçao", "Grenada", "Belize", "New Caledonia", "Lao People's Democratic Republic", "Saint Lucia", "Dominica", "Fiji", "Saint Kitts and Nevis", "Falkland Islands (Malvinas)", "Greenland", "Holy See (Vatican City State)", "Turks and Caicos Islands", "Montserrat", "Seychelles", "MS Zaandam", "Western Sahara", "British Virgin Islands", "Papua New Guinea", "Caribbean Netherlands", "St. Barth", "Lesotho", "Anguilla", "Saint Pierre Miquelon"]
    function nWSpace(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }

    useEffect(() => {
        const query = "country=ma&q=covid&from=from=2020-05-20&sortBy=publishedAt"
        getPopularNews(query)
    }, [])

    useEffect(() => {
        if(news !== null && news.length !== 0) {
            console.log(news)
            setNewsState(news)
            setError(null)
        }
        if(news !== null && news.length == 0) {
            setError("No news found")
        }
    }, [news])

    const filterCountries = (event) => {
        setTimeout(() => {
            let results
            if (event.query.length === 0) {
                results = [...countriesNames]
            }
            else {
                results = countriesNames.filter((country) => {
                    return country.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            setFilteredCountries(results);
        }, 250);
    }

    const onChange = (event) => {
        console.log(event)
        setSelectedCountry(event.value)
    }

    const onSearchClick = () => {
        const query = "country="+
        countries[selectedCountry].iso2.toLowerCase()+
        "&q=covid&from=from=2020-05-20&sortBy=publishedAt"
        getPopularNews(query)
    }

    const itemTemplate = (country) => {
        console.log(country)
        return (
            <div className="p-clearfix">
                <img alt={country} src={countries[country].flag} srcSet={countries[country].flag} style={{ width: '32px', display: 'inline-block', margin: '5px 0 2px 5px' }} />
                <div style={{ fontSize: '16px', float: 'right', margin: '10px 10px 0 0' }}>{country}</div>
            </div>
        );
    }

    return (
        <div className="p-grid nested-grid">
            <div className="p-col-12 p-md-6 p-lg-3">
                <AutoComplete value={selectedCountry} suggestions={filteredCountries} completeMethod={filterCountries} size={30} minLength={1}
                    placeholder="Search by country" dropdown={true} itemTemplate={itemTemplate} onChange={onChange} />
                
            </div>
            <div className="p-col-12 p-md-6 p-lg-9">
                <Button label="Search" className="p-button-raised" onClick={onSearchClick} />
                <span style={{marginLeft:"3%", color:"#FF0000", fontSize:"14px"}}>{error ? error : ""}</span>
            </div>
            <div className="p-grid">
                <div className="p-col-6">
                    <div className="box">
                        {newsState.length > 0 ? <NewsCard news={newsState[0]} />: "Loading..."}
                    </div>
                </div>
                <div className="p-col-6">
                    <div className="box">
                        {newsState.length > 1 ? <NewsCard news={newsState[1]}/>: ""}
                    </div>
                </div>
            </div>
            <div className="p-grid">
                <div className="p-col-4">
                    <div className="box">
                        {newsState.length > 2 ? <NewsCard news={newsState[2]}/>: ""}
                    </div>
                </div>
                <div className="p-col-4">
                    <div className="box box-stretched">
                        {newsState.length > 3 ? <NewsCard news={newsState[3]}/>: ""}
                    </div>
                </div>
                <div className="p-col-3">
                    <div className="box box-stretched">
                        {newsState.length > 4 ? <NewsCard news={newsState[4]}/>: ""}
                    </div>
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = state => ({
    news: state.news.articles,
    getPopularNews: PropTypes.func.isRequired,
})


export default connect(mapStateToProps, { getPopularNews })(NewsPage)