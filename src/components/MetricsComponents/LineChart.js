import 'primeicons/primeicons.css'
import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.css'
import 'primeflex/primeflex.css'
import '../../linechart.css'

import React from 'react';
import {Chart} from 'primereact/chart'
import { processScopedUiProps } from '@fullcalendar/core'

const LineChart = (props) => {
    const colors = {"cases": "#42A5F5", "deaths": "#FF0000", "recovered": "#66BB6A", "mean": "#00FF00", "r0value": "#000000"}
    const colors2 = {"cases": "#000000", "deaths": "#FF00FF", "recovered": "#FFAA00"}
    const labelNames = {"cases": "Cases", "deaths": "Deaths", "recovered": "Recovered", "mean": "Mean", "r0value": "R0"}
    let data = {
        labels: props.data.labels,
        datasets: []
    }
    let metric = {}
    data.datasets = props.data.data.map((line, i) => {
        return {
            label: labelNames[props.data.lines[i]],
            data: line,
            fill: false,
            backgroundColor: colors[props.data.lines[i]],
            borderColor: colors[props.data.lines[i]],
        }
    })
    if(props.data2) {
        props.data2.data.map((line, i) => {
            data.datasets.push({
                label: labelNames[props.data.lines[i]] + " C2",
                data: line,
                fill: false,
                backgroundColor: colors2[props.data2.lines[i]],
                borderColor: colors2[props.data2.lines[i]] 
            })
        })
    }
    if(props.prediction) {
        data.labels = [...data.labels, ...props.prediction.labels]
        for(let i = 0; i < props.prediction.labels; i++) {
            data.datasets[0].data.push(0)
        }
        console.log(data)
        props.prediction.data.map((line, i) => {
            data.datasets.push({
                label: "Cases prediction",
                data: [...data.datasets[0].data, ...line],
                fill: false,
                backgroundColor: "#111111",
                borderColor: "#111111"
            })
        })
    }
    if(props.metricPrediction) {
        console.log(props.metricPrediction)
        metric.labels = props.metricPrediction.labels
        metric.datasets = props.metricPrediction.data.map((line, i) => {
            return {
                label: labelNames[props.metricPrediction.lines[i]],
                data: line,
                fill: false,
                backgroundColor: colors[props.metricPrediction.lines[i]],
                borderColor: colors[props.metricPrediction.lines[i]],
            }
        })
    }
    return (
        <div>
            <h3>
            {!props.country1 ?
                <span>{props.country ? "Covid19 specific for " + props.country : "Covid19 Global"}</span>
                :   
                <span>{"Covid comparison between: " + props.country1 + " and " + props.country2}</span>
            }
            </h3>
            <Chart type="line" data={data} />
            {props.metricPrediction ? <Chart type="line" data={metric} /> : ""}
        </div>
    )
}
                
export default LineChart