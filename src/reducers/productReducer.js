export default function productReducer(state=null,action) {
    switch(action.type) {
        case "ADD_PRODUCT":
            return action.payload;
        default:
            return state;    
    }
}