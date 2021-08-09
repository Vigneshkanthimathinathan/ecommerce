import React,{useEffect, useState} from "react";
import { toast} from 'react-toastify';
import data from "../products.json"
import { useSelector,useDispatch } from "react-redux";
import {nanoid} from "nanoid";
import Cart from "./cart"
import Card from "../components/card";
import "../App.css"

const Home = ({history}) => {
  
  const dispatch = useDispatch();  
  const {user} = useSelector((state) =>({...state}));
  const {amount} = useSelector((state) =>({...state}));
  const {savings} = useSelector((state) =>({...state}));
  const [products,setProducts] = useState(data);
  const [addFormData,setAddFormData] = useState({
     id:"",
     productname:"",
     price:"",
  })

  const [cart,setCart] = useState([]);

  
  useEffect(() =>{
    try{
      if(!user) {
          history.push('/login');
      }
      dispatch({type: "SAVINGS",payload:{savingsAmount:0.00}});
    }
    catch(error) {
        console.log(error)
    }
  },[])
  // handling form input values to add a new product into list
  const handleAddFormChange = (e) =>{
    try{
        e.preventDefault();
        const fieldName = e.target.getAttribute("name");
        const fieldValue = e.target.value;
        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;
        setAddFormData(newFormData);
    }
    catch(error){
        console.log(error)
    }
  }
  // adding new product to the product list
  const handleAddFormSubmit = (e) => {
    try{
          e.preventDefault();
          const newProduct = {
              id: nanoid(),
              productname: addFormData.productname,
              price: addFormData.price, 
              quantity: 1,
              amount: addFormData.price,
              savings: 0.00
          };
          if(products.some(item => newProduct.productname === item.productname)){
              toast.error("Product is already present in the list")
          }
          else{
              const newProducts = [...products,newProduct]
              setProducts(newProducts);
          }
    }
    catch(error){
     console.log(error)
    }
  }

 //adding to cart/basket
  const addToCart = (product) =>{
    try{
      // Checking if product is already present in cart
     if(cart.some(item => product.productname === item.productname)) {
         toast.error("Already added to cart");
     }
     //Applying special offer conditions and adding to cart
     else {
       //special offer for butter
       if(product.productname==="Butter"){
           product.savings = parseFloat(product.price,10) / 3;
           dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount+=product.savings}});
       }
       else{
           dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount+=product.savings}});
       }
       //special offer for soup
       if(product.productname === "Soup") {
            let bread = cart.find(item => item.productname === "Bread");
            let index = cart.findIndex(item => item.productname === "Bread");
            if (typeof bread !== 'undefined') {
                if(bread.quantity >= product.quantity){
                      cart[index].savings = product.quantity * (parseFloat(bread.price,10) / 2);
                      dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount+=product.quantity*(parseFloat(bread.price,10) / 2)}});
                }
            }        
       }
       //special offer for half price bread
       if(product.productname === "Bread") {
            let soup =  cart.find(item => item.productname === "Soup");
            if (typeof soup !== 'undefined') { 
                if(product.savings === 0) {
                    product.savings = parseFloat(product.price,10) / 2;
                    dispatch({type: "SAVINGS",payload:{savingsAmount:savings.savingsAmount+=(parseFloat(product.price,10) / 2)}})
                }
            }
       }
        const items = [...cart,product];
        setCart(items);
        dispatch({type: "ADD_PRODUCT",payload:{data: items}});
        dispatch({type: "SUB_TOTAL",payload:{subTotal: amount.subTotal+parseFloat(product.price,10)*product.quantity}}); 
      }
    }
      catch(error) {
        console.log(error)
      } 
  }


  return(
     <div className="app-container" style={{display:"flex",justifyContent:"center"}}>
       <div style={{width:"40%",margin:"1%"}}>
        <h2>Add a Product</h2>
        <form onSubmit={handleAddFormSubmit} style={{display: "flex",gap: "5px"}}>        
            <input
              type="text"
              name="productname"
              required="required"
              placeholder="Enter product name"
              onChange={handleAddFormChange}
            />
            <input
              type="number"
              step="0.01"
              name="price"
              required="required"
              placeholder="Enter a price"
              onChange={handleAddFormChange}
            />
          <button type="submit">Add</button>
        </form>
        <br></br>
        
        <table border="1" style={{width:"auto"}}class="table table-striped table-hover table-sm table-info">
            <thead className="thead">
              <tr>
                <th>Products</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {products.map((product,index) => (
              <tr key={index}>
                <td>{product.productname}</td>
                <td>£ {product.price}</td>
                <td>
                  <button type="button" class="btn btn-info" onClick={() => addToCart(product)}>Add to cart</button>
                </td>
              </tr>
              ))}
            </tbody>
        </table>
        <Card/>
        </div>
        <div style={{width:"56%",margin:"1%"}}>
            <Cart items={cart}/>
        </div> 
     </div>
  )
}

export default Home;