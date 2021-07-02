import React, { Component } from 'react'
import "./index.css"
import Search from '../../container/Search'
import Map from '../../container/Map'
import LocationList from '../../container/LocationList'
export default class Main extends Component {
    render() {
        return (
            <div className="Main">
                <h1>Google Map Location and Time zone</h1>
                <Search currentLocation="Toronto" latLng = {{lat: 43.653226,lng: -79.3831843}}/>
                <Map/>
                <LocationList/>
            </div>
        )
    }
}
