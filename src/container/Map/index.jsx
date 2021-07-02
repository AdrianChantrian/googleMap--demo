import React, { Component } from 'react'
import "./index.css"
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { connect } from 'react-redux';
import { addToFavorite,removeFromFavorite,updateFavorite,updateFavoriteTime } from '../../redux/actions/favorite';
import { addMark,deleteMark,updateMark,updateColor,updateTime } from '../../redux/actions/mark';
import { formatDate} from '../../func';
// some const value for initial the map
const coords = {
    lat: 43.653226,
    lng: -79.3831843
  };
const google = window.google;
const currentSpotId = nanoid()
const params = {v: '3.exp', key: 'AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU'};
class Map extends Component {
    state = {
        currentSpot:{id:currentSpotId,lat:coords.lat,lng:coords.lng},
        //make sure navigator is called once only
        refresh:true,
        //information for infowindow
        info:{lat:coords.lat,lng:coords.lng,content:"initial spot"},
        //whether contextmenu should be shown
        visible: "hidden",
        //whether the mark clicked by rightmouse is in favorite list 
        isFav:false
    }
    //the coordinate of place where is clicked by right mouse
    clientX = 0
    clientY = 0
    //chosen mark information, additional isFav attribute to define whether it is in favorite List 
    currentMark = {}
    //mark clicked by right mouse, additional isFav attribute to define whether it is in favorite List 
    rightClickMark ={}
    //dragged mark, additional isFav attribute to define whether it is in favorite List 
    dragMark = {}
    //the rawOffest time of user place
    currentRawOffset = -18000
    //the dasOffet time of user place
    currentDstOffset = 3600
    //store interval for update time each second
    interval = null
    
    //get user place information and set time interval to update time every second when component did mount 
    componentDidMount(){
        const {refresh} = this.state
        //to get user location information
        if(refresh){
            navigator.geolocation.getCurrentPosition(
                position => {
                    if(this.props.markList.length === 0){
                        axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${position.coords.latitude},${position.coords.longitude}&timestamp=1331766000&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`).then(
                            response => {
                                this.currentRawOffset = response.data.rawOffset
                                this.currentDstOffset = response.data.dstOffset
                            },
                            error  => alert("please try again\n",error)
                        )
                        this.createMark(position.coords.latitude,position.coords.longitude)
                    }else{
                        this.props.updateMark({lat:this.state.currentSpot.lat,lng:this.state.currentSpot.lng},{lat:position.coords.latitude,lng:position.coords.longitude})
                    }
                    this.setState({
                        currentSpot:{id:currentSpotId,lat:position.coords.latitude,lng:position.coords.longitude},
                        info:{
                            lat:position.coords.latitude,
                            lng:position.coords.longitude,
                            content:"you are here"
                        },
                        refresh: false
                    })
                },
                error  => alert("please try again\n",error)
            )
        }
        //set interval for updating time every second
        if(!this.interval){
            this.interval = setInterval(() => {
                const timestamp = new Date().getTime() - this.currentRawOffset*1000 + this.currentDstOffset*1000
                this.props.updateTime(timestamp)
                this.props.updateFavoriteTime(timestamp)
                this.currentMark.timestamp += 1000
                this.currentMark.timeString = formatDate(this.currentMark.timestamp,this.currentMark.rawOffset)
            }, 1000);
        }
        // to prevent default event when right mouse is clicked
        document.addEventListener("contextmenu",this.cancleDefault)

    }
    //clear interval and remove listener when component will unmount
    componentWillUnmount(){
        if(this.interval){
            clearInterval(this.interval)
        }
        document.removeEventListener("contextmenu",this.cancleDefault)
    }
    
    // initial map information 
    onMapCreated(map) {
        map.setOptions({
            center: new google.maps.LatLng(this.lat,this.lng),
            disableDefaultUI: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    }

    //pick current dragged mark from mark list and store information to drageMark
    //check current dragged mark is in favorite list or not
    onDragStart = e => {
        let isFav = false
        for(const mark of this.props.favoriteList){
            if(mark.lat === e.latLng.lat() && mark.lng === e.latLng.lng()){
                isFav = true
                break
            }
        }
        for(const mark of this.props.markList){
            if(mark.lat === e.latLng.lat() && mark.lng === e.latLng.lng()){
                this.dragMark = {...mark,isFav}
                break
            }
        }

    }

    //update mark information in mark list and favorite list(if it is in favorite list)
    onDragEnd = e => {
        let preLatLng = {lat:this.dragMark.lat,lng:this.dragMark.lng}
        let mark = {lat:e.latLng.lat(),lng:e.latLng.lng(),isFav:this.dragMark.isFav}
        this.refreshMark(preLatLng,mark)
        this.dragMark = mark
    }

    //handle right mouse click event, to show contextmenu to user
    //based on isFav, the removefromfavorite and addToFavorite button will be set as disabled or able to click
    handleContextMenu = e => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        this.clientX = e.domEvent.clientX
        this.clientY = e.domEvent.clientY
        let isFav = false;
        //check current right click mark is in favorite list or not
        for(let i =0;i<this.props.favoriteList.length;i++){
            if(this.props.favoriteList[i].lat === lat && this.props.favoriteList[i].lng === lng){
                isFav = true;
                break;
            }
        }
        //get current right click mark information and store it in rightClickMark
        for(let i= 0 ;i< this.props.markList.length ;i++){
            if(this.props.markList[i].lat === lat && this.props.markList[i].lng === lng){
                this.rightClickMark = {...this.props.markList[i],isFav}
                break
            }
        }
        this.setState({
            visible:"visible",
            isFav
        })
    }

    //get chosen mark information and store it in currentMark, update color of marks
    onClickMark = e =>{
        //close contextmenu first if it is still visible
        if(this.state.visible ==="visible")
            this.setState({visible:"hidden"})
        else{
            let isFav = false;
            //check current mark is in favorite list or not
            for(const mark of this.props.favoriteList){
                if(mark.lat === e.latLng.lat() && mark.lng === e.latLng.lng()){
                    isFav = true;
                    break;
                }
            }
            //get current mark information and store it in currentMark
            for(const mark of this.props.markList){
                if(mark.lat === e.latLng.lat() && mark.lng === e.latLng.lng()){
                    this.currentMark = {...mark,isFav}
                    break;
                }
            }
            //update mark color
            this.props.updateColor({lat:e.latLng.lat(),lng:e.latLng.lng()},"blue")
        }
    }

    //click map to add new mark
    onClickMap = e => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        //close contextmenu first if it is visible
        if(this.state.visible === "visible")
            this.setState({visible:"hidden"})
        else
            this.createMark(lat,lng)
    }
    
    //add current rightClickMark to favorite list
    addFavorite = e =>{
        this.props.addToFavorite(this.rightClickMark)
        this.setState({visible:"hidden"})
    }
    //remove current rightClickMark from favorite list
    removeFromFavorite = e =>{
        this.props.removeFromFavorite(this.rightClickMark)
        this.setState({visible:"hidden"})
    }
    //remove current mark from map
    removeFromMap = e => {
        const latLng = {
            lat: this.rightClickMark.lat,
            lng: this.rightClickMark.lng
        }
        this.props.deleteMark(latLng)
        this.setState({visible:"hidden"})
    }
    //to prevent default right click event 
    cancleDefault= e => e.preventDefault()

    //update mark information if mark is dragged
    refreshMark(preLatLng,mark){
        //request new information from google geocoding api and time zone api
        let rawOffset = axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${mark.lat},${mark.lng}&timestamp=1331766000&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`)
        let address = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${mark.lat},${mark.lng}&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`)
        Promise.all([rawOffset,address]).then(
            response => {
                const timestamp = new Date().getTime() - this.currentRawOffset*1000 + response[0].data.rawOffset*1000 + response[0].data.dstOffset*1000;
                const timeString = formatDate(timestamp,rawOffset)
                //new mark only save data which is needed to update
                let newMark = {lat:mark.lat,lng:mark.lng,timestamp,timeString,dstOffset:response[0].data.dstOffset,rawOffset:response[0].data.rawOffset,address:response[1].data.results[0].formatted_address}
                this.props.updateMark(preLatLng,newMark)
                if(mark.isFav)
                    this.props.updateFavorite(preLatLng,newMark)
            },
            error  => alert("please try again\n",error)
        )
    }
    //create new mark and put it in mark list and save it as currentMark
    createMark(lat,lng){
        //request new information from google geocoding api and time zone api
        let rawOffset = axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=1331766000&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`)
        let address = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU`)
        Promise.all([rawOffset,address]).then(
            response => {
                let newMark = this.getMark(lat,lng,response[0].data.dstOffset,response[0].data.rawOffset,response[1].data.results[0].formatted_address)
                this.props.addMark(newMark)
                this.currentMark = {...newMark,isFav:false}
            },
            error  => alert("please try again\n",error)
        )
    }
    //generate mark information
    getMark(lat,lng,dstOffset,rawOffset,address){
        const id = nanoid()
        const timestamp = new Date().getTime() + rawOffset*1000 - this.currentRawOffset*1000 + this.currentDstOffset*1000 - dstOffset*1000;
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
        const {info} = this.state;
        return (
            <div className="Map">
               <Gmaps
                    ref={c=>this.map = c}
                    width={'500px'}
                    height={'500px'}
                    lat={this.props.markList.length >= 1 ? this.props.markList.filter(mark => mark.color === "blue")[0].lat : (this.currentMark.lat? this.currentMark.lat:coords.lat)}
                    lng={this.props.markList.length >= 1 ? this.props.markList.filter(mark => mark.color === "blue")[0].lng: (this.currentMark.lng? this.currentMark.lng:coords.lat)}
                    zoom={14}
                    loadingMessage={'Be happy'}
                    params={params}
                    onMapCreated={this.onMapCreated}
                    onClick={this.onClickMap}>
                    {
                        this.props.markList.length > 0 ?
                        this.props.markList.map(mark => 
                        <Marker icon={`http://maps.google.com/mapfiles/ms/icons/${mark.color}-dot.png`} key={mark.id} draggable={true} 
                        onDragStart={this.onDragStart} 
                        onDragEnd={this.onDragEnd} 
                        onClick={this.onClickMark} 
                        onRightClick = {this.handleContextMenu}
                        lat={mark.lat} lng={mark.lng}/>) : 
                        <Marker draggable={true} onDragEnd={this.onDragEnd} {...coords}/>

                    }
                    <InfoWindow {...info}/>
                    <Circle
                    lat={this.lat}
                    lng={this.lng}
                    radius={500}
                    />
                </Gmaps>
                <div className="current-mark">
                    <h2>Chosen Mark</h2>
                    <p>{this.props.markList.length > 0 ? this.props.markList.filter(mark => mark.color==="blue")[0].address:this.currentMark.address} 
                    <br/>
                    {this.props.markList.length > 0 ? this.props.markList.filter(mark => mark.color==="blue")[0].timeString:this.currentMark.timeString}
                    </p>
                </div>
                <div className="Menu" style = {{visibility:this.state.visible, top:this.clientY,left:this.clientX}}>
                    <button onClick = {this.addFavorite} disabled={this.state.isFav? true:false}>add to favorite</button>
                    <button onClick = {this.removeFromFavorite} disabled={this.state.isFav? false:true}>remove from favorite</button>
                    <button onClick = {this.removeFromMap}>remove from map</button>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({markList:state.markList,favoriteList:state.favoriteList}),
    {
        addToFavorite,
        removeFromFavorite,
        addMark,
        deleteMark,
        updateMark,
        updateTime,
        updateColor,
        updateFavorite,
        updateFavoriteTime
    }
)(Map)
