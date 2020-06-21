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

    return (
        <div>
            <h3>Covid19 Global {props.country ? " for " + props.country : ""}</h3>
            <Chart type="line" data={data} />
        </div>
    )
}
                
export default LineChart