import 'primeicons/primeicons.css'
import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.css'
import 'primeflex/primeflex.css'
import '../../linechart.css'

import React from 'react';
import {Chart} from 'primereact/chart'
import { processScopedUiProps } from '@fullcalendar/core'

const LineChart = (props) => {
    const colors = {"cases": "#42A5F5", "deaths": "#FF0000", "recovered": "#66BB6A"}
    const colors2 = {"cases": "#000000", "deaths": "#FF00FF", "recovered": "#FFAA00"}
    const labelNames = {"cases": "Cases", "deaths": "Deaths", "recovered": "Recovered"}
    let data = {
        labels: props.data.labels,
        datasets: []
    }
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

    return (
        <div>
            <h3>{props.country ? "Covid19 specific for " + props.country : "Covid19 Global"}</h3>
            <Chart type="line" data={data} />
        </div>
    )
}
                
export default LineChart