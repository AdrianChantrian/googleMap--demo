import { ADDFAV,REMOVEFAV,UPDATEFAV, UPDATEFAVTIME } from "../constant";
import { formatDate } from "../../func";
const initState = []

export default function favoriteReducer(prestate = initState,action){
    const {type,data} = action
    switch (type) {
        // add new mark to favorite(Map container has confirmed the chosen mark is not in favorite List)
        case ADDFAV:
            return [data, ...prestate]
        case REMOVEFAV:
        // compare the chosen mark and remove it from favorite list
            for(let i = 0; i < prestate.length; i++){
                if(prestate[i].lat === data.lat && prestate[i].lng === data.lng){
                    prestate.splice(i,1)
                    break;
                }
            }
            return [...prestate]
        case UPDATEFAV:
        //update the mark information when the mark in favorite list is dragged
            for(let i = 0;i < prestate.length;i++){
                if(prestate[i].lat === data.preLatLng.lat && prestate[i].lng === data.preLatLng.lng){
                    prestate[i].lat = data.mark.lat
                    prestate[i].lng = data.mark.lng
                    prestate[i].address = data.mark.address
                    prestate[i].timestamp = data.mark.timestamp
                    prestate[i].timeString = data.mark.timeString
                    prestate[i].rawOffset = data.mark.rawOffset
                    break
                }
            }
            return [...prestate]
        case UPDATEFAVTIME:
        //update timestamp and timeString for favorite marks
            for(const mark of prestate){
                mark.timestamp = data + (mark.rawOffset - mark.dstOffset)*1000
                mark.timeString = formatDate(mark.timestamp,mark.rawOffset)
            }
            return [...prestate]
        default:
            return prestate
    }
}