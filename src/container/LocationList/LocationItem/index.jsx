import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateColor } from '../../../redux/actions/mark'
import { removeFromFavorite } from '../../../redux/actions/favorite'
import "./index.css"
class LocationItem extends Component {
    state = {isMouseEnter: false}
    onMouseEnter = e =>{
        this.setState({isMouseEnter:true})
    }
    onMouseLeave = e =>{
        this.setState({isMouseEnter:false})
    }
    //pick the current favorite mark as chosen mark
    onClick = e =>{
        this.props.updateColor({lat:this.props.mark.lat,lng:this.props.mark.lng},"blue")
    }
    //delete current mark from favorite list
    handleDelete = e =>{
        this.props.removeFromFavorite(this.props.mark)
    }
    render() {
        const {isMouseEnter} = this.state
        return (
            <li className="Location-item" style={{backgroundColor: isMouseEnter ? '#f1f1f1':'white'}} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.onClick}>
                <span>{this.props.mark.address} <br/>{this.props.mark.timeString}</span>
                <button onClick={this.handleDelete} style={{display:isMouseEnter?'block':'none'}}>delete</button>
            </li>
        )
    }
}
export default connect(
    state =>({favoriteList:state.favoriteList}),
    {
        updateColor,
        removeFromFavorite
    }
)(LocationItem)
