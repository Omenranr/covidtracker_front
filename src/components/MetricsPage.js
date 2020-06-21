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
import { getHistorical, getCountryHistorical, getCountriesHistorical } from "../actions/dashActions"
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
        getHistorical,
        getCountryHistorical,
        getCountriesHistorical
    } = props
    const [filteredCountries, setFilteredCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [lineIndex, setLineIndex] = useState(0)
    const [dataState, setDataState] = useState({
        allHistorical: [],
        countryHistorical: null,
        countriesHistorical: []
    })
    const [checkedExact, setCheckedExact] = useState(false)
    const [toShowType, setToShowType] = useState(["cases", "deaths", "recovered"])
    const countries = countriesData
    const countriesNames = ["USA", "Brazil", "Russia", "India", "UK", "Spain", "Peru", "Italy", "Chile", "Iran", "Germany", "Turkey", "Pakistan", "Mexico", "France", "Saudi Arabia", "Bangladesh", "Canada", "South Africa", "Qatar", "China", "Colombia", "Belgium", "Belarus", "Sweden", "Egypt", "Ecuador", "Netherlands", "Indonesia", "UAE", "Singapore", "Argentina", "Kuwait", "Portugal", "Ukraine", "Poland", "Switzerland", "Philippines", "Iraq", "Oman", "Afghanistan", "Dominican Republic", "Ireland", "Panama", "Romania", "Bolivia", "Bahrain", "Israel", "Nigeria", "Armenia", "Japan", "Austria", "Kazakhstan", "Moldova", "Ghana", "Serbia", "Guatemala", "Denmark", "S. Korea", "Azerbaijan", "Algeria", "Honduras", "Cameroon", "Czechia", "Morocco", "Norway", "Nepal", "Malaysia", "Sudan", "Australia", "Côte d'Ivoire", "Finland", "Uzbekistan", "Senegal", "DRC", "Tajikistan", "Macedonia", "Haiti", "Guinea", "Djibouti", "Kenya", "El Salvador", "Ethiopia", "Gabon", "Luxembourg", "Hungary", "Bulgaria", "Venezuela", "Bosnia", "Greece", "Thailand", "Kyrgyzstan", "Mauritania", "Somalia", "Central African Republic", "Mayotte", "Cuba", "Croatia", "Maldives", "French Guiana", "Costa Rica", "Estonia", "Sri Lanka", "Mali", "Albania", "South Sudan", "Nicaragua", "Iceland", "Lithuania", "Equatorial Guinea", "Slovakia", "Guinea-Bissau", "Lebanon", "Slovenia", "New Zealand", "Madagascar", "Zambia", "Paraguay", "Sierra Leone", "Tunisia", "Hong Kong", "Latvia", "Niger", "Jordan", "Cyprus", "Yemen", "Burkina Faso", "Georgia", "Congo", "Cabo Verde", "Chad", "Andorra", "Uruguay", "Palestine", "Uganda", "Diamond Princess", "Rwanda", "San Marino", "Sao Tome and Principe", "Mozambique", "Malta", "Jamaica", "Benin", "Swaziland", "Malawi", "Liberia", "Channel Islands", "Togo", "Libyan Arab Jamahiriya", "Tanzania", "Réunion", "Zimbabwe", "Taiwan", "Montenegro", "Vietnam", "Mauritius", "Isle of Man", "Suriname", "Myanmar", "Comoros", "Martinique", "Mongolia", "Syrian Arab Republic", "Cayman Islands", "Faroe Islands", "Guyana", "Angola", "Gibraltar", "Guadeloupe", "Bermuda", "Eritrea", "Brunei", "Cambodia", "Trinidad and Tobago", "Bahamas", "Burundi", "Aruba", "Monaco", "Barbados", "Botswana", "Liechtenstein", "Sint Maarten", "Bhutan", "French Polynesia", "Namibia", "Macao", "Saint Martin", "Gambia", "Saint Vincent and the Grenadines", "Antigua and Barbuda", "Timor-Leste", "Curaçao", "Grenada", "Belize", "New Caledonia", "Lao People's Democratic Republic", "Saint Lucia", "Dominica", "Fiji", "Saint Kitts and Nevis", "Falkland Islands (Malvinas)", "Greenland", "Holy See (Vatican City State)", "Turks and Caicos Islands", "Montserrat", "Seychelles", "MS Zaandam", "Western Sahara", "British Virgin Islands", "Papua New Guinea", "Caribbean Netherlands", "St. Barth", "Lesotho", "Anguilla", "Saint Pierre Miquelon"]
    const options = [
        { label: 'Cases', value: 'cases' },
        { label: 'Deaths', value: 'deaths' },
        { label: 'Recovered', value: 'recovered' }
    ]

    function nWSpace(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }

    //useEffect Methods START
    useEffect(() => {
        getHistorical()
        getCountryHistorical('Morocco')
        getCountriesHistorical('Morocco,France')
    }, [])
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

    const onChange = (event) => {
        // console.log(event)
        setSelectedCountry(event.value)
    }

    const onSearchClick = () => {
        // console.log(selectedCountry)
        getCountryHistorical(selectedCountry)
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
        let labels = Object.keys(data[0].timeline.cases)
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
        let labels = Object.keys(data.timeline.cases)
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

    const lineModeText = () => {
        return checkedExact ? " Cumulative" : " Exact"
    }

    return (
        <div>
            <TabView activeIndex={lineIndex} onTabChange={(e) => setLineIndex(e.index)}>
                <TabPanel header="Global Data">
                    <div className="p-grid">
                        <div className="p-col-2">
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
                            <AutoComplete style={{marginLeft: "-20%"}} value={selectedCountry} suggestions={filteredCountries} completeMethod={filterCountries} size={30} minLength={1}
                                placeholder="Search by country" dropdown={true} itemTemplate={itemTemplate} onChange={onChange} />
                            <Button style={{marginLeft: "3%"}} label="Search" className="p-button-raised" onClick={onSearchClick} />
                        </div>
                    </div>
                    {dataState.countryHistorical ? 
                        <LineChart 
                            key={"chart2"} 
                            country={dataState.countryHistorical.country} 
                            data={selectLineModeCountry(dataState.countryHistorical, toShowType)} /> 
                            : "Loading..."}
                </TabPanel>
                <TabPanel header="Countries Comparison">
                    Content III
                </TabPanel>
            </TabView>
        </div>
    )
}

const mapStateToProps = state => ({
    allHistorical: state.dashData.allHistorical,
    countriesHistorical: state.dashData.countriesHistorical,
    countryHistorical: state.dashData.countryHistorical,
    getHistorical: PropTypes.func.isRequired,
    getCountryHistorical: PropTypes.func.isRequired,
    getCountriesHistorical: PropTypes.func.isRequired,
})


export default connect(mapStateToProps, { getHistorical, getCountryHistorical, getCountriesHistorical })(MetricsPage)