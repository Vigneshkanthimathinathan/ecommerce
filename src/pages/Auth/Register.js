import React, { useState,useEffect } from "react";
import {auth} from '../../firebase';
import { toast} from 'react-toastify';
import { useSelector } from "react-redux";
const Register = ({history}) => {
const[email,setEmail] = useState(""); 

const {user} = useSelector((state) =>({...state}));

useEffect(() =>{
  if(user && user.token) {
      history.push('/');
  }
},[user]);

const handleSubmit = async (e) => {
   try{
   e.preventDefault();
   const config = {
       url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
       handleCodeInApp: true,
   };
   await auth.sendSignInLinkToEmail(email,config);
   toast.success(
       `Email is sent to ${email}. Click the link to complete your registration.`
   );
   window.localStorage.setItem("emailForRegistration",email);
   setEmail("");
   }
   catch(error) {
       alert(error)
   }
};    
const registerForm = () => {
    return(
       <form onSubmit={handleSubmit}>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Please enter your email" autoFocus/>
          <button type='submit' className="btn btn-raised" style={{marginTop:20}}>
            Register
          </button>
       </form>
    );
}    
    return(
        <div className="container">
            <div className="row">
               <div className="col-md-6 offset-md-3">
                  <h4>Register</h4>
                  {registerForm()}
               </div>     
            </div>
        </div>
    );
};

export default Register;