import React, { Component } from 'react';

export class AppFooter extends Component {

    render() {
        return  (
            <div className="layout-footer">
                <span className="footer-text" style={{'marginRight': '5px'}}>CovidTracker</span>
                <span className="footer-text" style={{'marginLeft': '5px'}}> ENSIAS - 2020</span>
            </div>
        );
    }
}