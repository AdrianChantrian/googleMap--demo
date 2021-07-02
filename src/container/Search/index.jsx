import axios from 'axios'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addMark } from '../../redux/actions/mark'
import { nanoid } from 'nanoid'
import { formatDate } from '../../func'
import "./index.css"
class Search extends Component {
    // isAddress to check whether current input is addrees or latitude and lontitude, to decide search way for input
    //refresh is for get user current spot once
    state = {isAddress:true,refresh:true}
    //initial information
    location = ""
    currentRawOffset = -18000
    currentDstOffset = 3600
    //get and set user current place dstOffset and rawOffest
    componentDidMount(){
        if(this.state.refresh){
            navigator.geolocation.getCurrentPosition(
                position => {
                    if(this.state.refresh){
                        axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${position.coords.latitude},${position.coords.longitude}&timestamp=1331766000&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`).then(
                            response => {
                                this.currentRawOffset = response.data.rawOffset
                                this.currentDstOffset = response.data.dstOffset
                                this.setState({refresh:false})
                            },
                            error  => alert("please try again\n",error)
                        )
                    }
                },
                error  => alert("please try again\n",error)
            )
        }
    }

    //change isAddress based on selected option
    onChange= e => {
        if(e.target.options[e.target.options.selectedIndex].value === "address")
            this.setState({isAddress:true})
        else
            this.setState({isAddress:false})
    }

    //handle 'enter' button to search location
    onKeyUp = e =>{
        if(e.keyCode === 13){
            if(this.state.isAddress){
                const stringArray = this.address.value.split(" ")
                this.location = this.address.value
                let addString = ""
                for(const str of stringArray){
                    addString = addString.concat("+",str)
                }
                axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${addString}&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`).then(
                    response=> {
                        if(typeof(response.data.results[0]) === "undefined")
                            alert("invalid address")
                        else{
                            const {lat,lng} = response.data.results[0].geometry.location
                            this.createMark(lat,lng)
                        }
                    },
                    error  => alert("please try again\n",error)
                )
            }else{
                const latLng = this.address.value.split(",")
                this.createMark(latLng[0],latLng[1])
            }
        }
    }
    //handle search button to search loaction 
    onClick= e => {
        if(this.state.isAddress){
            const stringArray = this.address.value.split(" ")
            this.location = this.address.value
            let addString = ""
            for(const str of stringArray){
                addString = addString.concat("+",str)
            }
            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${addString}&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`).then(
                response=> {
                    if(typeof(response.data.results[0]) === "undefined")
                        alert("invalid address")
                    else{
                        const {lat,lng} = response.data.results[0].geometry.location
                        this.createMark(lat,lng)
                    }
                },
                error  => alert("please try again\n",error)
            )
        }else{
            const latLng = this.address.value.split(",")
            this.createMark(latLng[0],latLng[1])
        }
    }

    //create new mark of searched location
    createMark(lat,lng){
        let rawOffset = axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=1331766000&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`)
        let address = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`)
        Promise.all([rawOffset,address]).then(
            response => {
                if(!this.state.isAddress)
                    this.props.addMark(this.getMark(lat,lng,response[0].data.dstOffset,response[0].data.rawOffset,response[1].data.results[0].formatted_address))
                else
                    this.props.addMark(this.getMark(lat,lng,response[0].data.dstOffset,response[0].data.rawOffset,this.location))
                },
            error  => alert("please try again\n",error)
        )
    }

    //generate mark object
    getMark(lat,lng,dstOffset,rawOffset,address){
        const id = nanoid()
        const timestamp = new Date().getTime() + (rawOffset - this.currentRawOffset + this.currentDstOffset - dstOffset)*1000;;
        const timeString = formatDate(timestamp,rawOffset)
        const color = "blue"
        return{
            id,
            address,
            lat,
            lng,
            dstOffset,
            timeString,
            timestamp,
            rawOffset,
            color
        }
    }
    render() {
        return (
            <div className="Search">
                    <select onChange={this.onChange}>
                        <option value="address">address</option>
                        <option value="latLng">latLng</option>
                    </select>
                    <input ref = {c => this.address= c} type="text" onKeyUp={this.onKeyUp}
                    placeholder={
                        this.state.isAddress ?
                        (this.props.markList.length > 0 ? this.props.markList[0].address : this.props.currentLocation):
                        (this.props.markList.length > 0 ? this.props.markList[0].lat+","+this.props.markList[0].lng: this.props.latLng.lat+","+this.props.latLng.lng)
                        }/>
                    <button onClick={this.onClick}></button>

            </div>
        )
    }

}
export default connect(
    state=>({markList:state.markList}),
    {
        addMark
    }
)(Search)

