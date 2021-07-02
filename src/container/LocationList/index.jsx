import React, { Component } from 'react'
import { connect } from 'react-redux'
import "./index.css"
import LocationItem from './LocationItem'
class LocationList extends Component {
    render() {
        return (
            <div className="Location-list">
                <h2>Favorite Spot</h2>
                <ul>
                    {
                    /* dynamically update the favorite List*/
                    this.props.favoriteList.length > 0 ?
                    this.props.favoriteList.map(mark =><LocationItem key={mark.id} mark={mark}/>) :
                    <li></li>
                    }
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({marList:state.markList,favoriteList:state.favoriteList}),
    {}
)(LocationList)