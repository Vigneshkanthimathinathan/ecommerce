import React, { useState,useEffect } from "react";
import {auth,provider} from '../../firebase';
import { toast} from 'react-toastify';
import {Button} from "antd";
import { MailOutlined,GoogleOutlined} from "@ant-design/icons";
import { useDispatch,useSelector } from "react-redux";
import {Link} from "react-router-dom";
const Login = ({history}) => {

const[email,setEmail] = useState(""); 
const[password,setPassword] = useState("");
const[loading,setLoading] = useState(false);
const dispatch = useDispatch();

const {user} = useSelector((state) =>({...state}));

useEffect(() =>{
  if(user && user.token) {
      history.push('/');
  }
},[user]);

const googleLogin = async () =>{
   auth.signInWithPopup(provider)
   .then(async (result)=>{
      const {user} = result;
      const idTokenResult = await user.getIdTokenResult();
      dispatch({
        type: "LOGGED_IN_USER",
        payload:{
           email: user.email,
           token: idTokenResult.token,      
        },
       });
        history.push('/');
      })
      .catch((error)=>{
        console.log(error)
        toast.error(error.message);
    });
}


const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   try{
      const result = await auth.signInWithEmailAndPassword(email,password);
      const {user} = result;
      const idTokenResult = await user.getIdTokenResult();
      
      dispatch({
          type: "LOGGED_IN_USER",
          payload:{
             email: user.email,
             token: idTokenResult.token,      
          },
      });
      history.push('/')
   } catch(error){
      console.log(error)
      toast.error(error.message)
      setLoading(false)
   }
};    
const loginForm = () => {
    return(
       <form onSubmit={handleSubmit}>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Please enter your email" autoFocus/>
             <br/>
            <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Your password"></input>
            <br/>
            <Button onClick={handleSubmit} type="primary" class="mb-3" block shape="round" icon={<MailOutlined/>} size="large" disabled={!email || password.length<6}>
                Login with Email & Password
            </Button>
             <br/><br/>
            <Button onClick={googleLogin} type="danger" class="mb-3" block shape="round" icon={<GoogleOutlined/>} size="large">
                Login with Google
            </Button>
            <br/>
            <Link to="/forgot/password" className="float-end text-danger">Forgot Password</Link> 
       </form>
    );
}    
    return(
        <div className="container">
            <div className="row">
               <div className="col-md-6 offset-md-3">
                  {loading?
                  <h4 className="text-danger">Loading...Please wait</h4> :
                  <h4>Login</h4>
                   }
                  {loginForm()}
               </div>     
            </div>
        </div>
    );
};

export default Login;