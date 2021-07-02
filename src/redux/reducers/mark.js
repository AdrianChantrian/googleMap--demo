// import axios from "axios";
import { formatDate } from "../../func";
import { ADDMARK, DELETEMARK,UPDATEMARK,UPDATECOLOR,UPDATETIME } from "../constant";
// import { formatDate } from "../../func";

const initState = []
// function getCurrent(){
//     let lat,lng,rawOffset,address,timeString
//     let timestamp = new Date().getTime()
//     navigator.geolocation.getCurrentPosition(
//         position => {
//             lat = position.coords.latitude
//             lng = position.coords.longitude
//         },
//         error => console.log(error)
//     )
//     axios.get('https://maps.googleapis.com/maps/api/timezone/json?location='+ lat +','+ lng +'&timestamp=1331161200&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU').then(
//         response => { },
//         error => {console.log("失败",error)}
//     )
//     axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key=AIzaSyCyUVsNJgD8fGLebs_WCyI4MPUTL22PHSU').then(
//         response => {address = response.data.results[0].formatted_address},
//         error => {console.log("失败",error)}

//     )
//     timeString = formatDate(timestamp,rawOffset)
//     return {
//         id:nanoid(),
//         address,
//         lat,
//         lng,
//         timeString,
//         timestamp,
//         rawOffset
//     }
// }

export default function searchReducer(prestate = initState,action){
    const {type,data} = action
    switch (type) {
        case ADDMARK:
        //make sure the same spot will not be added into mark list multiple times
            for(const mark of prestate){
                if(mark.lat === data.lat && mark.lng === data.lng)
                    return [...prestate]
            }
        //to set the color of mark as red(the new mark is automatically as chosen mark and its color is blue)
            for(const mark of prestate){
                mark.color = "red"
            }
            return [...prestate,data]
        case DELETEMARK:
        //delete chosen mark from mark list
            for(let i = 0;i<prestate.length;i++){
                if(prestate[i].lat === data.lat && prestate[i].lng === data.lng){
                    prestate.splice(i,1)
                    break
                }
            }
            return [...prestate]
        case UPDATEMARK:
        //update mark information when mark is dragged
            for(let i = 0;i<prestate.length;i++){
                if(prestate[i].lat === data.preLatLng.lat && prestate[i].lng === data.preLatLng.lng){
                    prestate[i].lat = data.mark.lat
                    prestate[i].lng = data.mark.lng
                    prestate[i].address = data.mark.address
                    prestate[i].timestamp = data.mark.timestamp
                    prestate[i].timeString = data.mark.timeString
                    prestate[i].rawOffset = data.mark.rawOffset
                    prestate[i].dstOffset = data.mark.dstOffset
                    break
                }
            }
            return [...prestate]
        case UPDATECOLOR:
        //update mark color when chosen mark is changed
            for(const mark of prestate){
                if(mark.lat === data.latLng.lat && mark.lng === data.latLng.lng){
                    mark.color = data.color
                }else{
                    mark.color = "red"
                }
            }
            return [...prestate]
        case UPDATETIME:
        //update timestamp and timeString of marks 
            for(const mark of prestate){
                mark.timestamp = data + (mark.rawOffset - mark.dstOffset)*1000
                mark.timeString = formatDate(mark.timestamp,mark.rawOffset)
            }
            return [...prestate]
        default:
            return prestate;
    }
}