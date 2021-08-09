import React, {useState} from "react";
import { Menu} from 'antd';
import { UserOutlined,UserAddOutlined,AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import firebase from 'firebase';
import { useDispatch,useSelector } from "react-redux";
import {useHistory} from "react-router-dom";


const { SubMenu,Item } = Menu;

const Header = () => {
   const[current,setCurrent] = useState("home");
   let dispatch = useDispatch();
   let {user} = useSelector((state)=>({...state}));
   let history = useHistory();
   const handleClick = (e) => {
     setCurrent(e.key);
   }

   const logout = () => {
      firebase.auth().signOut()
      dispatch({
        type: "LOGOUT",
        payload: null,
      });
      history.push("/login");
   }

   return( 
       <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" style={{display:"flex",paddingLeft:"600px"}}>
          {user&&(
           <>
             <Item key="home" icon={<AppstoreOutlined />}>
               <Link to="/">Home</Link>
             </Item>
             <SubMenu key="SubMenu" icon={<SettingOutlined />} title={user.email && user.email.split('@')[0]}>
               <Menu.ItemGroup>
                 <Item icon={<UserOutlined/>} onClick={logout}>Logout</Item>
               </Menu.ItemGroup>
             </SubMenu>
           </>    
          )} 
           {!user&&(
             <Item key="register" icon={<UserAddOutlined />}>
               <Link to="/register">Register</Link>
             </Item>
           )}
           {!user&&(
             <Item key="login" icon={<UserOutlined />}>
               <Link to="/login">Login</Link>
             </Item>
           )}
        </Menu>
   )
}

export default Header;