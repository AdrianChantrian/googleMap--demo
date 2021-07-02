import { createStore,combineReducers } from "redux";
import favoriteReducer from "./reducers/favorite";
import markReducer from "./reducers/mark";

const allReducers = combineReducers({
    favoriteList:favoriteReducer,
    markList:markReducer
})
export default createStore(allReducers);