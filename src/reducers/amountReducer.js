export default function amountReducer(state={subTotal:0.00},action) {
    switch(action.type) {
        case "SUB_TOTAL":
            return action.payload;      
        default:
            return state;    
    }
}