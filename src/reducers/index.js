import { combineReducers } from "redux";
import productReducer from "./productReducer";
import userReducer from "./userReducer";
import amountReducer from "./amountReducer";
import savingsReducer from "./savingsReducer";


export const rootReducer = combineReducers({
    user: userReducer,
    product: productReducer,
    amount: amountReducer,
    savings: savingsReducer
});