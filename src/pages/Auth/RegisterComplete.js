import React, { useState,useEffect } from "react";
import {auth} from '../../firebase';
import { toast} from 'react-toastify';
const RegisterComplete = ({history}) => {
   const[email,setEmail] = useState("");
   const [password,setPassword] = useState(""); 
   useEffect(()=>{
        setEmail(window.localStorage.getItem('emailForRegistration'));
   },[])   
   const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password) {
        toast.error('Email and password is required');
        return;
    }
    if(password.length<6) {
        toast.error("Password must be atleast 6 characters");
        return;
    }
   try{
      const result = await auth.signInWithEmailLink(email,window.location.href)
      if(result.user.emailVerified){
          //Remove user from local storage
          window.localStorage.removeItem("emailForRegistration");
          //get current user and update password
          let user = auth.currentUser;
          await user.updatePassword(password);
          const idTokenResult = await user.getIdTokenResult();
          //redux store
           console.log("user",user,"idTokenResult",idTokenResult);
          //redirect
          history.push('/');
      }
    }
   catch(error) {
       toast.error(error.message);
   }
};    
const completeRegistrationForm = () => {
    return(
       <form onSubmit={handleSubmit}>
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} disabled/>
        <br/>
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set Password" autoFocus />
        <button type='submit' className="btn btn-raised" style={{marginTop:20}}>
          Complete Registration
        </button>
       </form>
    );
}    
    return(
        <div className="container">
            <div className="row">
               <div className="col-md-6 offset-md-3">
                  <h4>Register Complete</h4>
                  {completeRegistrationForm()}
               </div>     
            </div>
        </div>
    );
};

export default RegisterComplete;