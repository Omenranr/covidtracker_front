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
import { CoronaDataTable } from "./CoronaDataTable";
//actions functions & redux imports
import { getCurrentData, getTotalData } from "../actions/dashActions";
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import { v1 as uuid } from 'uuid'

const Dashboard = (props) => {

    const { getCurrentData, getTotalData } = props

    const [dataState, setDataState] = useState({
        countriesData: [],
        topCountries: [],
        totalData: {},
    })

    //get current covid19 data on page load
    useEffect(() => {
        getCurrentData()
        getTotalData()
    }, [])

    //put current data in the dataState
    useEffect(() => {
        if (props.currentData !== null) {
            setDataState(prev => ({
                ...prev,
                countriesData: props.currentData,
                topCountries: props.currentData.slice(0, 3)
            }))
            console.log(props.currentData)
            let countries = {}
            for(let i = 0; i < props.currentData.length; i++) {
                countries[props.currentData[i].country] = {name: props.currentData[i].country, ...props.currentData[i].countryInfo}
            }
            console.log(JSON.stringify(countries))
        }
    }, [props.currentData])
    //put total data in the dataState
    useEffect(() => {
        if (props.totalData !== null) {
            setDataState(prev => ({
                ...prev,
                totalData: props.totalData
            }))
            console.log(props.totalData)
        }
    }, [props.totalData])

    function nWSpace(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    const toShow = (data) => {
        let toShow = []
        for(let i = 0; i < data.length; i++) {
            let current = data[i]
            let objShow = {
                id : uuid(),
                cases : current.cases,
                todayCases : current.todayCases,
                active : current.active,
                deaths : current.deaths,
                todayDeaths : current.todayDeaths,
                recovered : current.recovered,
                todayRecovered : current.todayRecovered,
                critical : current.critical,
                population: current.population,
                casesPerOneMillion : current.casesPerOneMillion,
                deathsPerOneMillion : current.deathsPerOneMillion,
                tests : current.tests,
                testsPerOneMillion : current.testsPerOneMillion,
                country : {
                    name: current.country,
                    code: current.countryInfo.iso2,
                    image: current.countryInfo.flag,
                },
            }
            toShow.push(objShow)
        }
        return toShow
    }

    return (
        <div className="p-grid p-fluid dashboard">
            <div className="p-col-12 p-lg-4">
                {dataState.topCountries.length !== 0 ?
                    <div className="card summary">
                        <span className="title">
                            Top 1: {dataState.topCountries[0].country} Active cases
                        </span>
                        <span className="detail">
                            <img
                                src={dataState.topCountries[0].countryInfo.flag}
                                width="35"
                                alt="avatar1"
                            />
                        </span>
                        <span className="count deaths">{nWSpace(dataState.topCountries[0].active)}</span>
                    </div>
                    : ""
                }
            </div>
            <div className="p-col-12 p-lg-4">
                {dataState.topCountries.length !== 0 ?
                    <div className="card summary">
                        <span className="title">
                            Top 2: {dataState.topCountries[1].country} Active cases
                        </span>
                        <span className="detail">
                            <img
                                src={dataState.topCountries[1].countryInfo.flag}
                                width="35"
                                alt="avatar1"
                            />
                        </span>
                        <span className="count deaths">{nWSpace(dataState.topCountries[1].active)}</span>
                    </div>
                    : ""
                }
            </div>
            <div className="p-col-12 p-lg-4">
                {dataState.topCountries.length !== 0 ?
                    <div className="card summary">
                        <span className="title">
                            Top 3: {dataState.topCountries[2].country} Active cases
                        </span>
                        <span className="detail">
                            <img
                                src={dataState.topCountries[2].countryInfo.flag}
                                width="35"
                                alt="avatar1"
                            />
                        </span>
                        <span className="count deaths">{nWSpace(dataState.topCountries[2].active)}</span>
                    </div>
                    : ""
                }
            </div>

            <div className="p-col-12 p-md-6 p-xl-3">
                {dataState.totalData !== null && Object.keys(dataState.totalData).length !== 0 ?
                    <div className="highlight-box">
                        <div className="initials" style={{ backgroundColor: '#007be5', color: '#ffff' }}><span>TOTAL</span></div>
                        <div className="highlight-details ">
                            <i className="pi pi-search" />
                            <span>Total cases</span>
                            <span className="count">{nWSpace(dataState.totalData.cases)}</span>
                        </div>
                    </div>
                    : ""
                }
            </div>
            <div className="p-col-12 p-md-6 p-xl-3">
                {dataState.totalData !== null && Object.keys(dataState.totalData).length !== 0 ?
                    <div className="highlight-box">
                        <div className="initials" style={{ backgroundColor: '#e77e28', color: '#ffff' }}><span>ACTIVE</span></div>
                        <div className="highlight-details ">
                            <i className="pi pi-users" />
                            <span>Current actives</span>
                            <span className="count">{nWSpace(dataState.totalData.active)}</span>
                        </div>
                    </div>
                    : ""
                }
            </div>
            <div className="p-col-12 p-md-6 p-xl-3">
                {dataState.totalData !== null && Object.keys(dataState.totalData).length !== 0 ?
                    <div className="highlight-box">
                        <div className="initials" style={{ backgroundColor: 'rgb(171, 26, 26)', color: '#ffff' }}><span>DEATHS</span></div>
                        <div className="highlight-details ">
                            <i className="pi pi-times" />
                            <span>Total deaths</span>
                            <span className="count">{nWSpace(dataState.totalData.deaths)}</span>
                        </div>
                    </div>
                    : ""
                }
            </div>
            <div className="p-col-12 p-md-6 p-xl-3">
                {dataState.totalData !== null && Object.keys(dataState.totalData).length !== 0 ?
                <div className="highlight-box">
                    <div className="initials" style={{ backgroundColor: '#20d077', color: '#ffff' }}><span>RECOVERIES</span></div>
                    <div className="highlight-details ">
                        <i className="pi pi-check" />
                        <span>Total recoveries</span>
                        <span className="count">{nWSpace(dataState.totalData.recovered)}</span>
                    </div>
                </div>
                : ""
                }
            </div>
            <div className="p-col-12 p-md-6 p-lg-12">
                {dataState.countriesData.length !== 0 ? 
                <CoronaDataTable data={toShow(dataState.countriesData)}/> 
                : ""}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    currentData: state.dashData.currentData,
    getCurrentData: PropTypes.func.isRequired,
    totalData: state.dashData.totalData,
    getTotalData: PropTypes.func.isRequired,
})


export default connect(mapStateToProps, { getCurrentData, getTotalData })(Dashboard)