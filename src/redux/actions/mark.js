import { ADDMARK,DELETEMARK,UPDATEMARK,UPDATECOLOR,UPDATETIME } from "../constant";

export const addMark = mark => ({type:ADDMARK,data:mark})
export const deleteMark = latLng => ({type:DELETEMARK,data:latLng})
//call when mark is dragged
export const updateMark = (preLatLng,mark) => ({type:UPDATEMARK,data:{preLatLng,mark}})
//call when the chosen mark is changed to update mark color
export const updateColor = (latLng,color) => ({type:UPDATECOLOR,data:{latLng,color}})
//call every second for updating timestamp and timeString
export const updateTime = (timestamp)=> ({type:UPDATETIME,data:timestamp})