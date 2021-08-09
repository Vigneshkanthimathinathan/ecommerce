import React, { useEffect } from "react";
import {Switch,Route,Redirect} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import Header from"./components/nav/header";
import RegisterComplete from "./pages/Auth/RegisterComplete";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import {auth} from './firebase'
import { useDispatch,useSelector } from "react-redux";



const App = () => {
  let dispatch = useDispatch()
  const {user} = useSelector((state) => ({...state}))
  useEffect(() =>{
      const unsubscribe = auth.onAuthStateChanged(async (user) =>{
        if(user) {
            const idTokenResult = await user.getIdTokenResult()
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                email: user.email, 
                token: idTokenResult,
              }
            })
        }
      })
      return () => unsubscribe();
  },[])
  return(
    <>
    <Header/>
    <ToastContainer/>
    <Switch>     
      <Route exact path="/" component={Home}></Route> 
      <Route exact path ="/login" component = {Login}></Route>
      <Route exact path = "/register" component = {Register}></Route>
      <Route exact path = "/register/complete" component={RegisterComplete}/>
      <Route exact path = "/forgot/password" component={ForgotPassword}/>
    </Switch>
    </>
  );
};

export default App;