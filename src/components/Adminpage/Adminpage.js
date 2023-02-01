import React,{useState} from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useLocation, useHistory } from "react-router-dom";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";

import logo from '../../assets/logo.svg';
import UserDetailList from "./UserDetailList";
import { api_url } from '../../api/api';

const Adminpage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const isAdmin = sessionStorage.getItem('ctype');
  
    const [user,setUser] = useState(isAdmin);
    const [showpassword, setShowpassword] = useState(true);
    const history = useHistory();
    
    const adminAuth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api_url}/Adminlogin`, {
                email: email,
                password: password
            
            });
            
            // const decode = jwt_decode(response.data[1]);
            sessionStorage.setItem('cid', response.data[1].id);
            sessionStorage.setItem('cname', response.data[1].username);
            sessionStorage.setItem('ctype', response.data[1].usertype);
            setUser(2);
            history.push("/admin");
        } catch (error) {
            if (error.response) {
                setUser("");
                setMsg(error.response.data.msg);
            }
        }
    }
    const Logout = async () => {
        try {
            await axios.delete(`${api_url}/logout`);
            sessionStorage.removeItem('cid');
            sessionStorage.removeItem('cname');
            sessionStorage.removeItem('ctype');
            setUser("");
            history.push("/admin");
        } catch (error) {
            console.log(error);
        }
    }
    
    const GoDashboard = async () => {
        try {
            
            let usertype = sessionStorage.getItem('ctype');
            let userid = sessionStorage.getItem('cid');
            let username = sessionStorage.getItem('cname');
            history.push("/dashboard",{usertype,userid,username});
        } catch (error) {
            console.log(error);
        }
    }
    console.log('userstate', user);
    if(user==2){
        console.log('fdsfs')
        return(
            <div className="index-container brown-image">
                <img src={logo} alt="Logo" className="logo-image"/>
                <div className="investment-container">
                    <div className="Dashboard">Administrator</div>
                    <div className="float-left">
                        <button  className="button-logout"  onClick={Logout}>LOGOUT</button>
                        <button  className="button-logout"  onClick={GoDashboard}>CLIENT</button>
                    </div>
                    <div className="user-data">
                        <UserDetailList />
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="index-container brown-image">
                <img src={logo} alt="Logo" className="logo-image"/>
                <div className="login-container">
                    <form  onSubmit={adminAuth} className="form-container">
                        <p className="welcome">Welcome</p>
                        <p className="dualnet">Dualnet Administrator</p>
                        
                        <div className="row  row-first">
                            <label >UserName or Email</label>
                            <input type="text"  placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="row">
                            <label id="passwordlabel">Enter your password</label>
                            <div className="div-input-eye">
                                <input type={showpassword?"text":"password"}  placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {showpassword?<AiFillEye className="eye-visible" onClick={()=>{  setShowpassword(false)}}/>
                                            :<AiFillEyeInvisible className="eye-visible" onClick={()=>{  setShowpassword(true)}}/> }
                            </div>
                           
                        </div>
                        <div id="button" className="row">
                            <button >log in</button>
                        </div>
                        <p className="text-invalid">{msg}</p>
                    
                    </form>
                    <div className="imagediv-login">
                    </div>
                </div>
            </div>
        );   
    }

}

export default Adminpage;


