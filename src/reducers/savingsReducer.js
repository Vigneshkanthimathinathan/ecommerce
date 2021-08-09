export default function savingsReducer(state=null,action) {
    switch(action.type) {
        case "SAVINGS":
            return action.payload;      
        default:
            return state;    
    }
}