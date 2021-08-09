import React from "react";
import { useSelector,useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Cart = (props) => {
    const dispatch = useDispatch();
    let {product} = useSelector((state)=>({...state}));
    let {amount} = useSelector((state) =>({...state}));
    let {savings} = useSelector((state) =>({...state}));
    if(props.items.length === 0){
        return(
            <h2>Cart is empty</h2>
        )
    }
    // Remove product from cart
    const removeProduct = async (prod,index) => {
       if(prod.quantity === 1) {
            await dispatch({type: "SUB_TOTAL",payload:{subTotal: amount.subTotal-prod.price}})
            dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount-prod.savings}});
            if(prod.productname === "Soup") {
                let index = product.data.findIndex(item => item.productname === "Bread");
                if (typeof index !== 'undefined' && index!== -1) {
                    product.data[index].savings = 0.00;
                    dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount-=prod.quantity*(parseFloat(product.data[index].price,10) / 2)}});
                }
            }  
            product.data.splice(index,1)
            dispatch({type: "ADD_PRODUCT",payload:{data: product.data}});
       }
       else {
            await dispatch({type: "SUB_TOTAL",payload:{subTotal: amount.subTotal-(prod.price*parseInt(prod.quantity))}})
            dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount-prod.savings}}); 
            if(prod.productname === "Soup") {
                let index = product.data.findIndex(item => item.productname === "Bread");
                if (typeof index !== 'undefined') {
                    if(index!== -1){
                    product.data[index].savings = 0.00;
                    dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount-=prod.quantity*(parseFloat(product.data[index].price,10) / 2)}});
                    }
                }
            }  
            product.data.splice(index,1)
            dispatch({type: "ADD_PRODUCT",payload:{data: product.data}}); 
        }
    }
    // Add Quantity of items in cart
    const addQuantity = (prod,index) => {
       var qty =  parseInt(product.data[index].quantity);
       product.data[index].quantity = qty + 1;
       if(prod.productname==="Butter") {
           product.data[index].savings += parseFloat(prod.price,10) / 3;
           dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount+=parseFloat(prod.price,10) / 3}});
       }
       if(prod.productname==="Cheese") {
           if(product.data[index].quantity%2===0) {
              product.data[index].savings += prod.price;
              dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount+=prod.price}});
           }
       }
       if(prod.productname==="Soup"){
           let bread = product.data.find(item => item.productname === "Bread");
           let idx = product.data.findIndex(item => item.productname === "Bread");
           if (typeof bread !== 'undefined') {
                if(bread.quantity >= prod.quantity){
                    product.data[idx].savings = prod.quantity * (parseFloat(bread.price,10) / 2);
                    dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount+=(parseFloat(bread.price,10) / 2)}})
                }
            }     
       }
       if(prod.productname==="Bread") {
           let soup = product.data.find(item => item.productname === "Soup");
           if(typeof soup !== 'undefined') {
               if(prod.quantity <= soup.quantity){
                   product.data[index].savings += (parseFloat(prod.price,10) / 2);
                   dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount+=(parseFloat(prod.price,10) / 2)}})
               }
           }
       }
       dispatch({type: "ADD_PRODUCT",payload:{data: product.data}}); 
       dispatch({type: "SUB_TOTAL",payload:{subTotal: amount.subTotal+parseFloat(prod.price,10)}});
    } 
    //Reduce quantity in cart
    const reduceQuantity = (prod,index) => {
       var qty =  parseInt(product.data[index].quantity)
       if(qty>1) {
       product.data[index].quantity = qty - 1
       if(prod.productname==="Butter") {
           product.data[index].savings -= parseFloat(prod.price,10) / 3;
           dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount-=parseFloat(prod.price,10) / 3}});
       }
       if(prod.productname==="Cheese") {
            if(product.data[index].quantity%2===1) {
                product.data[index].savings -= prod.price;
                dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount-=prod.price}});
            }
       }
       if(prod.productname==="Soup"){
        let bread = product.data.find(item => item.productname === "Bread");
        let idx = product.data.findIndex(item => item.productname === "Bread");
           if (typeof bread !== 'undefined') {
                if(bread.quantity > prod.quantity){
                    product.data[idx].savings -= (parseFloat(bread.price,10) / 2);
                    dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount-=(parseFloat(bread.price,10) / 2)}})
                }
           }     
       } 
       if(prod.productname==="Bread") {
        let soup = product.data.find(item => item.productname === "Soup");
            if(typeof soup !== 'undefined') {
                if(prod.quantity < soup.quantity){
                    product.data[index].savings -= (parseFloat(prod.price,10) / 2);
                    dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount-=(parseFloat(prod.price,10) / 2)}})
                }
            }
       }      
       dispatch({type: "ADD_PRODUCT",payload:{data: product.data}});
       dispatch({type: "SUB_TOTAL",payload:{subTotal: amount.subTotal-parseFloat(prod.price,10)}})
       }
       else{
           toast.error("You can remove the product")
       }
    }
    //placeOrder 

    const placeOrder = () => {
        if(product.data.length === 0)
        {
            toast.error("Please add items in the cart to place order")
        }
        else {
            toast.success("your order has been placed successfully")
            //connect with backend(axios or fetch api)
            // or connect to firebase firestore
        }
    } 

    return(
    <div>
        <h2>Basket</h2>
        <table border="1" style={{width:"auto"}} class="table table-striped table-hover table-sm table-warning">
            <thead>
                <tr>
                <th>Products</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total((price*qty)-savings)</th>
                <th>Savings</th>
                <th>Inc/Dec Qty</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {product.data.map((prod,index) => (
                    <tr key={index}>
                    <td>{prod.productname}</td>
                    <td>£ {prod.price}</td>
                    <td>{prod.quantity} </td>
                    <td>£{prod.price} * {prod.quantity} - {prod.savings.toFixed(1)} = £{((prod.price*prod.quantity)-prod.savings.toFixed(1)).toFixed(1)}</td>
                    <td>£{prod.savings.toFixed(1)}</td>
                    <td style={{display:"flex",gap:"5px"}}>
                        <button style={{backgroundColor:"orange"}} onClick={() => {addQuantity(prod,index)}}> + </button>
                        {prod.quantity} 
                        <button style={{backgroundColor:"orange"}} onClick={() => {reduceQuantity(prod,index)}}> - </button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-warning" onClick={() => {removeProduct(prod,index)}}>Remove</button>
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <p>SubTotal:     £ {amount.subTotal.toFixed(1)}</p>
        <p>Savings:      £ {savings.savingsAmount.toFixed(1)}</p>
        <p>Total Amount: £ {(amount.subTotal-savings.savingsAmount).toFixed(1)}</p>
        <button type="button" class="btn btn-primary" onClick={() => {placeOrder()}}>Place Order</button>
    </div>
    )
}

export default Cart;