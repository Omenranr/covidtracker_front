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
import { TabView, TabPanel } from 'primereact/tabview'
import { LineChart } from "./MetricsComponents"
import { SelectButton } from 'primereact/selectbutton'
//actions functions & redux imports
import {
    getHistorical,
    getCountryHistorical,
    getCountriesHistorical,
    getCountryPrediction,
    getMetricPrediction
} from "../actions/dashActions"
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import { v1 as uuid } from 'uuid'
import NewsCard from './NewsCard'
import countriesData from '../countries.json'

const MetricsPage = (props) => {
    const {
        allHistorical,
        countryHistorical,
        countriesHistorical,
        countryPrediction,
        countryMetricPrediction,
        getHistorical,
        getCountryHistorical,
        getCountriesHistorical,
        getCountryPrediction,
        getMetricPrediction
    } = props
    const [filteredCountries, setFilteredCountries] = useState([])
    const [filteredCountries1, setFilteredCountries1] = useState([])
    const [filteredCountries2, setFilteredCountries2] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("Morocco")
    const [selectedCountry1, setSelectedCountry1] = useState(null)
    const [selectedCountry2, setSelectedCountry2] = useState(null)
    const [lineIndex, setLineIndex] = useState(0)
    const [dataState, setDataState] = useState({
        allHistorical: [],
        countryHistorical: null,
        countriesHistorical: [],
        countryPrediction: null,
        countryMetricsPrediction: null
    })
    const [checkedExact, setCheckedExact] = useState(false)
    const [toShowType, setToShowType] = useState(["cases", "deaths", "recovered"])
    const [toShowMetric, setToShowMetric] = useState(["mean", "r0value"])
    const countries = countriesData
    const countriesNames = ["USA", "Brazil", "Russia", "India", "UK", "Spain", "Peru", "Italy", "Chile", "Iran", "Germany", "Turkey", "Pakistan", "Mexico", "France", "Saudi Arabia", "Bangladesh", "Canada", "South Africa", "Qatar", "China", "Colombia", "Belgium", "Belarus", "Sweden", "Egypt", "Ecuador", "Netherlands", "Indonesia", "UAE", "Singapore", "Argentina", "Kuwait", "Portugal", "Ukraine", "Poland", "Switzerland", "Philippines", "Iraq", "Oman", "Afghanistan", "Dominican Republic", "Ireland", "Panama", "Romania", "Bolivia", "Bahrain", "Israel", "Nigeria", "Armenia", "Japan", "Austria", "Kazakhstan", "Moldova", "Ghana", "Serbia", "Guatemala", "Denmark", "S. Korea", "Azerbaijan", "Algeria", "Honduras", "Cameroon", "Czechia", "Morocco", "Norway", "Nepal", "Malaysia", "Sudan", "Australia", "Côte d'Ivoire", "Finland", "Uzbekistan", "Senegal", "DRC", "Tajikistan", "Macedonia", "Haiti", "Guinea", "Djibouti", "Kenya", "El Salvador", "Ethiopia", "Gabon", "Luxembourg", "Hungary", "Bulgaria", "Venezuela", "Bosnia", "Greece", "Thailand", "Kyrgyzstan", "Mauritania", "Somalia", "Central African Republic", "Mayotte", "Cuba", "Croatia", "Maldives", "French Guiana", "Costa Rica", "Estonia", "Sri Lanka", "Mali", "Albania", "South Sudan", "Nicaragua", "Iceland", "Lithuania", "Equatorial Guinea", "Slovakia", "Guinea-Bissau", "Lebanon", "Slovenia", "New Zealand", "Madagascar", "Zambia", "Paraguay", "Sierra Leone", "Tunisia", "Hong Kong", "Latvia", "Niger", "Jordan", "Cyprus", "Yemen", "Burkina Faso", "Georgia", "Congo", "Cabo Verde", "Chad", "Andorra", "Uruguay", "Palestine", "Uganda", "Diamond Princess", "Rwanda", "San Marino", "Sao Tome and Principe", "Mozambique", "Malta", "Jamaica", "Benin", "Swaziland", "Malawi", "Liberia", "Channel Islands", "Togo", "Libyan Arab Jamahiriya", "Tanzania", "Réunion", "Zimbabwe", "Taiwan", "Montenegro", "Vietnam", "Mauritius", "Isle of Man", "Suriname", "Myanmar", "Comoros", "Martinique", "Mongolia", "Syrian Arab Republic", "Cayman Islands", "Faroe Islands", "Guyana", "Angola", "Gibraltar", "Guadeloupe", "Bermuda", "Eritrea", "Brunei", "Cambodia", "Trinidad and Tobago", "Bahamas", "Burundi", "Aruba", "Monaco", "Barbados", "Botswana", "Liechtenstein", "Sint Maarten", "Bhutan", "French Polynesia", "Namibia", "Macao", "Saint Martin", "Gambia", "Saint Vincent and the Grenadines", "Antigua and Barbuda", "Timor-Leste", "Curaçao", "Grenada", "Belize", "New Caledonia", "Lao People's Democratic Republic", "Saint Lucia", "Dominica", "Fiji", "Saint Kitts and Nevis", "Falkland Islands (Malvinas)", "Greenland", "Holy See (Vatican City State)", "Turks and Caicos Islands", "Montserrat", "Seychelles", "MS Zaandam", "Western Sahara", "British Virgin Islands", "Papua New Guinea", "Caribbean Netherlands", "St. Barth", "Lesotho", "Anguilla", "Saint Pierre Miquelon"]
    const countriesISO = { "USA": "US", "Brazil": "BR", "Russia": "RU", "India": "IN", "UK": "GB", "Spain": "ES", "Peru": "PE", "Chile": "CL", "Italy": "IT", "Iran": "IR", "Germany": "DE", "Turkey": "TR", "Pakistan": "PK", "Mexico": "MX", "Saudi Arabia": "SA", "France": "FR", "Bangladesh": "BD", "Canada": "CA", "South Africa": "ZA", "Qatar": "QA", "China": "CN", "Colombia": "CO", "Belgium": "BE", "Belarus": "BY", "Egypt": "EG", "Sweden": "SE", "Ecuador": "EC", "Netherlands": "NL", "Indonesia": "ID", "UAE": "AE", "Argentina": "AR", "Singapore": "SG", "Kuwait": "KW", "Portugal": "PT", "Ukraine": "UA", "Iraq": "IQ", "Poland": "PL", "Switzerland": "CH", "Oman": "OM", "Philippines": "PH", "Afghanistan": "AF", "Dominican Republic": "DO", "Panama": "PA", "Ireland": "IE", "Bolivia": "BO", "Romania": "RO", "Bahrain": "BH", "Israel": "IL", "Armenia": "AM", "Nigeria": "NG", "Japan": "JP", "Kazakhstan": "KZ", "Austria": "AT", "Moldova": "MD", "Ghana": "GH", "Azerbaijan": "AZ", "Guatemala": "GT", "Serbia": "RS", "Honduras": "HN", "Denmark": "DK", "S. Korea": "KR", "Algeria": "DZ", "Cameroon": "CM", "Czechia": "CZ", "Morocco": "MA", "Nepal": "NP", "Norway": "NO", "Sudan": "SD", "Malaysia": "MY", "Côte d'Ivoire": "CI", "Australia": "AU", "Finland": "FI", "Uzbekistan": "UZ", "Senegal": "SN", "DRC": "CD", "Tajikistan": "TJ", "Haiti": "HT", "Macedonia": "MK", "Guinea": "GN", "El Salvador": "SV", "Kenya": "KE", "Ethiopia": "ET", "Djibouti": "DJ", "Gabon": "GA", "Luxembourg": "LU", "Hungary": "HU", "Venezuela": "VE", "Bulgaria": "BG", "Bosnia": "BA", "Kyrgyzstan": "KG", "Greece": "GR", "Thailand": "TH", "Mauritania": "MR", "Central African Republic": "CF", "Somalia": "SO", "French Guiana": "GF", "Mayotte": "YT", "Croatia": "HR", "Cuba": "CU", "Costa Rica": "CR", "Maldives": "MV", "Albania": "AL", "Estonia": "EE", "Mali": "ML", "Sri Lanka": "LK", "South Sudan": "SS", "Iceland": "IS", "Nicaragua": "NI", "Lithuania": "LT", "Equatorial Guinea": "GQ", "Madagascar": "MG", "Lebanon": "LB", "Slovakia": "SK", "Guinea-Bissau": "GW", "Slovenia": "SI", "New Zealand": "NZ", "Zambia": "ZM", "Paraguay": "PY", "Sierra Leone": "SL", "Hong Kong": "HK", "Tunisia": "TN", "Latvia": "LV", "Congo": "CG", "Jordan": "JO", "Niger": "NE", "Palestine": "PS", "Cyprus": "CY", "Yemen": "YE", "Cabo Verde": "CV", "Georgia": "GE", "Burkina Faso": "BF", "Uruguay": "UY", "Chad": "TD", "Andorra": "AD", "Benin": "BJ", "Uganda": "UG", "Malawi": "MW", "Mozambique": "MZ", "Rwanda": "RW", "Diamond Princess": null, "Sao Tome and Principe": "ST", "San Marino": "SM", "Malta": "MT", "Jamaica": "JM", "Liberia": "LR", "Swaziland": "SZ", "Libyan Arab Jamahiriya": "LY", "Channel Islands": "JE", "Togo": "TG", "Tanzania": "TZ", "Réunion": "RE", "Zimbabwe": "ZW", "Taiwan": "TW", "Montenegro": "ME", "Vietnam": "VN", "Mauritius": "MU", "Isle of Man": "IM", "Suriname": "SR", "Myanmar": "MM", "Comoros": "KM", "Martinique": "MQ", "Syrian Arab Republic": "SY", "Mongolia": "MN", "Cayman Islands": "KY", "Faroe Islands": "FO", "Angola": "AO", "Guyana": "GY", "Gibraltar": "GI", "Guadeloupe": "GP", "Bermuda": "BM", "Burundi": "BI", "Eritrea": "ER", "Brunei": "BN", "Cambodia": "KH", "Trinidad and Tobago": "TT", "Bahamas": "BS", "Aruba": "AW", "Monaco": "MC", "Barbados": "BB", "Botswana": "BW", "Liechtenstein": "LI", "Sint Maarten": "SX", "Bhutan": "BT", "Namibia": "NA", "French Polynesia": "PF", "Macao": "MO", "Saint Martin": "MF", "Gambia": "GM", "Saint Vincent and the Grenadines": "VC", "Antigua and Barbuda": "AG", "Timor-Leste": "TL", "Curaçao": "CW", "Grenada": "GD", "Belize": "BZ", "New Caledonia": "NC", "Lao People's Democratic Republic": "LA", "Saint Lucia": "LC", "Dominica": "DM", "Fiji": "FJ", "Saint Kitts and Nevis": "KN", "Turks and Caicos Islands": "TC", "Falkland Islands (Malvinas)": "FK", "Greenland": "GL", "Holy See (Vatican City State)": "VA", "Lesotho": "LS", "Montserrat": "MS", "Seychelles": "SC", "Western Sahara": "EH", "MS Zaandam": null, "Papua New Guinea": "PG", "British Virgin Islands": "VG", "Caribbean Netherlands": "BQ", "St. Barth": "BL", "Anguilla": "AI", "Saint Pierre Miquelon": "PM" }
    let countriesIsoToName = { "US": "USA", "BR": "Brazil", "RU": "Russia", "IN": "India", "GB": "UK", "ES": "Spain", "PE": "Peru", "CL": "Chile", "IT": "Italy", "IR": "Iran", "DE": "Germany", "TR": "Turkey", "PK": "Pakistan", "MX": "Mexico", "SA": "Saudi Arabia", "FR": "France", "BD": "Bangladesh", "CA": "Canada", "ZA": "South Africa", "QA": "Qatar", "CN": "China", "CO": "Colombia", "BE": "Belgium", "BY": "Belarus", "EG": "Egypt", "SE": "Sweden", "EC": "Ecuador", "NL": "Netherlands", "ID": "Indonesia", "AE": "UAE", "AR": "Argentina", "SG": "Singapore", "KW": "Kuwait", "PT": "Portugal", "UA": "Ukraine", "IQ": "Iraq", "PL": "Poland", "CH": "Switzerland", "OM": "Oman", "PH": "Philippines", "AF": "Afghanistan", "DO": "Dominican Republic", "PA": "Panama", "IE": "Ireland", "BO": "Bolivia", "RO": "Romania", "BH": "Bahrain", "IL": "Israel", "AM": "Armenia", "NG": "Nigeria", "JP": "Japan", "KZ": "Kazakhstan", "AT": "Austria", "MD": "Moldova", "GH": "Ghana", "AZ": "Azerbaijan", "GT": "Guatemala", "RS": "Serbia", "HN": "Honduras", "DK": "Denmark", "KR": "S. Korea", "DZ": "Algeria", "CM": "Cameroon", "CZ": "Czechia", "MA": "Morocco", "NP": "Nepal", "NO": "Norway", "SD": "Sudan", "MY": "Malaysia", "CI": "Côte d'Ivoire", "AU": "Australia", "FI": "Finland", "UZ": "Uzbekistan", "SN": "Senegal", "CD": "DRC", "TJ": "Tajikistan", "HT": "Haiti", "MK": "Macedonia", "GN": "Guinea", "SV": "El Salvador", "KE": "Kenya", "ET": "Ethiopia", "DJ": "Djibouti", "GA": "Gabon", "LU": "Luxembourg", "HU": "Hungary", "VE": "Venezuela", "BG": "Bulgaria", "BA": "Bosnia", "KG": "Kyrgyzstan", "GR": "Greece", "TH": "Thailand", "MR": "Mauritania", "CF": "Central African Republic", "SO": "Somalia", "GF": "French Guiana", "YT": "Mayotte", "HR": "Croatia", "CU": "Cuba", "CR": "Costa Rica", "MV": "Maldives", "AL": "Albania", "EE": "Estonia", "ML": "Mali", "LK": "Sri Lanka", "SS": "South Sudan", "IS": "Iceland", "NI": "Nicaragua", "LT": "Lithuania", "GQ": "Equatorial Guinea", "MG": "Madagascar", "LB": "Lebanon", "SK": "Slovakia", "GW": "Guinea-Bissau", "SI": "Slovenia", "NZ": "New Zealand", "ZM": "Zambia", "PY": "Paraguay", "SL": "Sierra Leone", "HK": "Hong Kong", "TN": "Tunisia", "LV": "Latvia", "CG": "Congo", "JO": "Jordan", "NE": "Niger", "PS": "Palestine", "CY": "Cyprus", "YE": "Yemen", "CV": "Cabo Verde", "GE": "Georgia", "BF": "Burkina Faso", "UY": "Uruguay", "TD": "Chad", "AD": "Andorra", "BJ": "Benin", "UG": "Uganda", "MW": "Malawi", "MZ": "Mozambique", "RW": "Rwanda", "null": "MS Zaandam", "ST": "Sao Tome and Principe", "SM": "San Marino", "MT": "Malta", "JM": "Jamaica", "LR": "Liberia", "SZ": "Swaziland", "LY": "Libyan Arab Jamahiriya", "JE": "Channel Islands", "TG": "Togo", "TZ": "Tanzania", "RE": "Réunion", "ZW": "Zimbabwe", "TW": "Taiwan", "ME": "Montenegro", "VN": "Vietnam", "MU": "Mauritius", "IM": "Isle of Man", "SR": "Suriname", "MM": "Myanmar", "KM": "Comoros", "MQ": "Martinique", "SY": "Syrian Arab Republic", "MN": "Mongolia", "KY": "Cayman Islands", "FO": "Faroe Islands", "AO": "Angola", "GY": "Guyana", "GI": "Gibraltar", "GP": "Guadeloupe", "BM": "Bermuda", "BI": "Burundi", "ER": "Eritrea", "BN": "Brunei", "KH": "Cambodia", "TT": "Trinidad and Tobago", "BS": "Bahamas", "AW": "Aruba", "MC": "Monaco", "BB": "Barbados", "BW": "Botswana", "LI": "Liechtenstein", "SX": "Sint Maarten", "BT": "Bhutan", "NA": "Namibia", "PF": "French Polynesia", "MO": "Macao", "MF": "Saint Martin", "GM": "Gambia", "VC": "Saint Vincent and the Grenadines", "AG": "Antigua and Barbuda", "TL": "Timor-Leste", "CW": "Curaçao", "GD": "Grenada", "BZ": "Belize", "NC": "New Caledonia", "LA": "Lao People's Democratic Republic", "LC": "Saint Lucia", "DM": "Dominica", "FJ": "Fiji", "KN": "Saint Kitts and Nevis", "TC": "Turks and Caicos Islands", "FK": "Falkland Islands (Malvinas)", "GL": "Greenland", "VA": "Holy See (Vatican City State)", "LS": "Lesotho", "MS": "Montserrat", "SC": "Seychelles", "EH": "Western Sahara", "PG": "Papua New Guinea", "VG": "British Virgin Islands", "BQ": "Caribbean Netherlands", "BL": "St. Barth", "AI": "Anguilla", "PM": "Saint Pierre Miquelon" }
    const options = [
        { label: 'Cases', value: 'cases' },
        { label: 'Deaths', value: 'deaths' },
        { label: 'Recovered', value: 'recovered' }
    ]
    const optionsMetric = [
        { label: 'Mean', value: 'mean' },
        { label: 'R0', value: 'r0value' }
    ]

    //useEffect Methods START
    useEffect(() => {
        getHistorical()
        getCountryHistorical('Morocco')
        getCountriesHistorical('Morocco,France')
    }, [])
    useEffect(() => {
        if (countryMetricPrediction) {
            setDataState(prev => {
                let correctCountryMetricPrediction = {}
                correctCountryMetricPrediction.country = countriesIsoToName[countryMetricPrediction[0].country]
                correctCountryMetricPrediction.timeline = {}
                correctCountryMetricPrediction.timeline.mean = {}
                correctCountryMetricPrediction.timeline.r0value = {}
                for (let i = 0; i < countryMetricPrediction.length; i++) {
                    correctCountryMetricPrediction.timeline.mean[countryMetricPrediction[i].date] = countryMetricPrediction[i].mean
                    correctCountryMetricPrediction.timeline.r0value[countryMetricPrediction[i].date] = Math.abs(countryMetricPrediction[i].r0value - 0.8)
                }
                console.log(correctCountryMetricPrediction)
                return {
                    ...prev,
                    countryMetricsPrediction: correctCountryMetricPrediction
                }
            })
        }
    }, [countryMetricPrediction])
    useEffect(() => {
        if (countryPrediction && countryPrediction.length > 0) {
            setDataState(prev => {
                let correctCountryPrediction = {}
                correctCountryPrediction.country = countriesIsoToName[countryPrediction[0].country]
                correctCountryPrediction.timeline = {}
                correctCountryPrediction.timeline.cases = {}
                for (let i = 0; i < countryPrediction.length; i++) {
                    correctCountryPrediction.timeline.cases[countryPrediction[i].date] = countryPrediction[i].cases
                }
                console.log(correctCountryPrediction)
                return {
                    ...prev,
                    countryPrediction: correctCountryPrediction
                }
            })
        }
    }, [countryPrediction])
    useEffect(() => {
        if (allHistorical != null && allHistorical.length !== 0) {
            // console.log("all historical", allHistorical)
            setDataState(prev => ({
                ...prev,
                allHistorical: allHistorical
            }))
        }
    }, [allHistorical])
    useEffect(() => {
        if (countryHistorical != null && countryHistorical !== undefined) {
            // console.log("country historical", countryHistorical)
            setDataState(prev => ({
                ...prev,
                countryHistorical: countryHistorical
            }))
        }
    }, [countryHistorical])
    useEffect(() => {
        if (countriesHistorical != null && countriesHistorical.length !== 0) {
            console.log("countries historical", countriesHistorical)
            setDataState(prev => ({
                ...prev,
                countriesHistorical: countriesHistorical
            }))
        }
    }, [countriesHistorical])
    //useEffect Methods END --


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

    const filterCountries1 = (event) => {
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
            setFilteredCountries1(results);
        }, 250);
    }
    const filterCountries2 = (event) => {
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
            setFilteredCountries2(results);
        }, 250);
    }

    const onChange = (event) => {
        // console.log(event)
        setSelectedCountry(event.value)
    }
    const onChange1 = (event) => {
        // console.log(event)
        setSelectedCountry1(event.value)
    }
    const onChange2 = (event) => {
        // console.log(event)
        setSelectedCountry2(event.value)
    }

    const onSearchClick = () => {
        // console.log(selectedCountry)
        getCountryHistorical(selectedCountry)
        setDataState(prev => ({
            ...prev,
            countryPrediction: null,
            countryMetricsPrediction: null,
        }))
    }
    const onSearchCamparisonClick = () => {
        if (selectedCountry1 && selectedCountry2) {
            getCountriesHistorical(selectedCountry1 + "," + selectedCountry2)
        }
    }

    const itemTemplate = (country) => {
        return (
            <div className="p-clearfix">
                <img alt={country} src={countries[country].flag} srcSet={countries[country].flag} style={{ width: '32px', display: 'inline-block', margin: '5px 0 2px 5px' }} />
                <div style={{ fontSize: '16px', float: 'right', margin: '10px 10px 0 0' }}>{country}</div>
            </div>
        );
    }

    const mapToLineCum = (data, lines) => {
        let labels = Object.keys(data[0].timeline[lines[0]])
        let dataR = []
        let line, sum
        for (let l = 0; l < lines.length; l++) {
            line = []
            for (let j = 0; j < labels.length; j++) {
                sum = 0
                for (let i = 0; i < data.length; i++) {
                    sum += data[i].timeline[lines[l]][labels[j]]
                }
                line.push(sum)
            }
            dataR.push(line)
        }
        // console.log(dataR)
        return {
            labels: labels,
            data: dataR,
            lines: lines
        }
    }

    const mapToLineExact = (data, lines) => {
        let cum = mapToLineCum(data, lines)
        let exact, line
        exact = []
        for (let i = 0; i < cum.data.length; i++) {
            line = []
            for (let j = 1; j < cum.data[i].length; j++) {
                line.push(cum.data[i][j] - cum.data[i][j - 1])
            }
            exact.push(line)
        }
        cum.data = exact
        // console.log(cum)
        return cum
    }

    const mapToLineCumCountry = (data, lines) => {
        if (data !== null) {
            let labels = Object.keys(data.timeline[lines[0]])
            let dataR = []
            let line
            for (let l = 0; l < lines.length; l++) {
                line = []
                for (let i = 0; i < Object.values(data.timeline[lines[l]]).length; i++) {
                    line.push(data.timeline[lines[l]][labels[i]])
                }
                dataR.push(line)
            }
            // console.log(dataR)
            return {
                labels: labels,
                data: dataR,
                lines: lines
            }
        }
    }

    const mapToLineExactCountry = (data, lines) => {
        let cum = mapToLineCumCountry(data, lines)
        let exact, line
        exact = []
        for (let i = 0; i < cum.data.length; i++) {
            line = []
            for (let j = 1; j < cum.data[i].length; j++) {
                line.push(cum.data[i][j] - cum.data[i][j - 1])
            }
            exact.push(line)
        }
        cum.data = exact
        // console.log(cum)
        return cum
    }

    const selectLineMode = (data, lines) => {
        return checkedExact ? mapToLineExact(data, lines) : mapToLineCum(data, lines)
    }

    const selectLineModeCountry = (data, lines) => {
        return checkedExact ? mapToLineExactCountry(data, lines) : mapToLineCumCountry(data, lines)
    }

    const selectLineModePrediction = (data, lines) => {
        if (data) {
            return checkedExact ? mapToLineExactCountry(data, lines) : mapToLineCumCountry(data, lines)
        }
    }

    const lineModeText = () => {
        return checkedExact ? " Cumulative" : " Exact"
    }

    const onPredictClick = () => {
        console.log(selectedCountry)
        getCountryPrediction(countriesISO[selectedCountry])
        getMetricPrediction(countriesISO[selectedCountry])
        setToShowType(["cases"])
    }

    const downloadData = () => {
        let filename = "data.json"
        let contentType = "application/json;charset=utf-8;"
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            let blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(dataState)))], { type: contentType })
            navigator.msSaveOrOpenBlob(blob, filename)
        } else {
            let a = document.createElement('a')
            a.download = filename
            a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(dataState))
            a.target = '_blank'
            document.body.appendChild(a)
            a.click();
            document.body.removeChild(a)
        }
    }

    return (
        <div>
            <TabView activeIndex={lineIndex} onTabChange={(e) => setLineIndex(e.index)}>
                <TabPanel header="Global Data">
                    <div className="p-grid">
                        <div className="p-col-2">
                            <button className="p-link" onClick={downloadData}>
                                <span className="layout-topbar-icon pi pi-download" />
                            </button>
                            <label htmlFor="cb2" className="p-checkbox-label">{"Switch to" + lineModeText() + " "}</label>
                            <Checkbox inputId="cb2" checked={checkedExact} onChange={e => setCheckedExact(e.checked)} />
                        </div>
                        <div className="p-col-6">
                            <div className="p-grid">
                                <div className="p-col-3">
                                    Lines to show
                            </div>
                                <div className="p-col-5" style={{ marginLeft: "-10%" }}>
                                    <SelectButton inputId="type" value={toShowType} multiple={true} options={options} onChange={(e) => setToShowType(e.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {dataState.allHistorical.length > 0 ? <LineChart key={"chart1"} data={selectLineMode(dataState.allHistorical, toShowType)} /> : "Loading..."}
                </TabPanel>
                <TabPanel header="Specific Country">
                    <div className="p-grid">
                        <div className="p-col-2">
                            <button className="p-link" onClick={downloadData}>
                                <span className="layout-topbar-icon pi pi-download" />
                            </button>
                            <label htmlFor="cb2" className="p-checkbox-label">{"Switch to" + lineModeText() + " "}</label>
                            <Checkbox inputId="cb2" checked={checkedExact} onChange={e => setCheckedExact(e.checked)} />
                        </div>
                        <div className="p-col-6">
                            <div className="p-grid">
                                <div className="p-col-3">
                                    Lines to show
                            </div>
                                <div className="p-col-5" style={{ marginLeft: "-10%" }}>
                                    <SelectButton inputId="type" value={toShowType} multiple={true} options={options} onChange={(e) => setToShowType(e.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="p-col-4">
                            <AutoComplete style={{ marginLeft: "-20%" }} value={selectedCountry} suggestions={filteredCountries} completeMethod={filterCountries} size={30} minLength={1}
                                placeholder="Search by country" dropdown={true} itemTemplate={itemTemplate} onChange={onChange} />
                            <Button style={{ marginLeft: "3%" }} label="Search" className="p-button-raised" onClick={onSearchClick} />
                            <Button style={{ marginLeft: "3%" }} label="Predict" className="p-button-raised" onClick={onPredictClick} />
                        </div>
                    </div>
                    {dataState.countryHistorical ?
                        <LineChart
                            key={"chart2"}
                            country={dataState.countryHistorical.country}
                            data={selectLineModeCountry(dataState.countryHistorical, toShowType)}
                            prediction={selectLineModePrediction(dataState.countryPrediction, ["cases"])}
                            metricPrediction={selectLineModePrediction(dataState.countryMetricsPrediction, toShowMetric)}
                        />
                        : "Loading..."}
                    {dataState.countryMetricsPrediction ?
                        <div className="p-col-5">
                            <SelectButton inputId="type" value={toShowMetric} multiple={true} options={optionsMetric} onChange={(e) => setToShowMetric(e.value)} />
                        </div>
                        : ""
                    }
                </TabPanel>
                <TabPanel header="Countries Comparison">
                    <div className="p-grid">
                        <div className="p-col-2">
                            <button className="p-link" onClick={downloadData}>
                                <span className="layout-topbar-icon pi pi-download" />
                            </button>
                            <label htmlFor="cb2" className="p-checkbox-label">{"Switch to" + lineModeText() + " "}</label>
                            <Checkbox inputId="cb2" checked={checkedExact} onChange={e => setCheckedExact(e.checked)} />
                        </div>
                        <div className="p-col-6">
                            <div className="p-grid">
                                <div className="p-col-3">
                                    Lines to show
                            </div>
                                <div className="p-col-5" style={{ marginLeft: "-10%" }}>
                                    <SelectButton inputId="type" value={toShowType} multiple={true} options={options} onChange={(e) => setToShowType(e.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="p-col-4">
                        </div>
                        <AutoComplete value={selectedCountry1} suggestions={filteredCountries1} completeMethod={filterCountries1} size={30} minLength={1}
                            placeholder="First country" dropdown={true} itemTemplate={itemTemplate} onChange={onChange1} />
                        <AutoComplete style={{ marginLeft: "-5%" }} value={selectedCountry2} suggestions={filteredCountries2} completeMethod={filterCountries2} size={30} minLength={1}
                            placeholder="Second country" dropdown={true} itemTemplate={itemTemplate} onChange={onChange2} />
                        <Button style={{ marginLeft: "3%" }} label="Search" className="p-button-raised" onClick={onSearchCamparisonClick} />
                    </div>
                    {dataState.countriesHistorical.length > 0 ?
                        <LineChart
                            key={"chart2"}
                            // country={dataState.countryHistorical.country} 
                            data={selectLineModeCountry(dataState.countriesHistorical[0], toShowType)}
                            data2={selectLineModeCountry(dataState.countriesHistorical[1], toShowType)}
                            country1={dataState.countriesHistorical[0].country}
                            country2={dataState.countriesHistorical[1].country}
                        />
                        : "Loading..."}
                </TabPanel>
            </TabView>
        </div>
    )
}

const mapStateToProps = state => ({
    allHistorical: state.dashData.allHistorical,
    countriesHistorical: state.dashData.countriesHistorical,
    countryHistorical: state.dashData.countryHistorical,
    countryPrediction: state.dashData.countryPrediction,
    countryMetricPrediction: state.dashData.countryMetricPrediction,
    getHistorical: PropTypes.func.isRequired,
    getCountryHistorical: PropTypes.func.isRequired,
    getCountriesHistorical: PropTypes.func.isRequired,
    getCountryPrediction: PropTypes.func.isRequired,
})


export default connect(mapStateToProps, { getHistorical, getCountryHistorical, getCountriesHistorical, getCountryPrediction, getMetricPrediction })(MetricsPage)