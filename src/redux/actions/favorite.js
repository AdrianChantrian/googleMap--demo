import { ADDFAV,REMOVEFAV,UPDATEFAV,UPDATEFAVTIME } from "../constant";

export const addToFavorite = mark => ({type:ADDFAV,data:mark})
export const removeFromFavorite = mark => ({type:REMOVEFAV,data:mark})
//call when the favorite mark is dragged, to update the information
export const updateFavorite = (preLatLng,mark) => ({type:UPDATEFAV,data:{preLatLng,mark}})
//call every second to update timestamp and timeString
export const updateFavoriteTime = timestamp => ({type:UPDATEFAVTIME,data:timestamp})