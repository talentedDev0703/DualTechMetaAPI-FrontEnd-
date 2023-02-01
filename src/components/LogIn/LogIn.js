import React,{useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {ImUserPlus} from 'react-icons/im'
import {MdAttachEmail} from 'react-icons/md'
import {RiLockPasswordFill} from 'react-icons/ri'
import {IoKeySharp} from 'react-icons/io5'
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";

import logo from '../../assets/logo.svg';
import "./Login.css";
import "../Adminpage/Adminpage.css";
import { api_url } from '../../api/api';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showpassword, setShowpassword] = useState(true);
    const [msg, setMsg] = useState('');

    const [regist_username, setRegistUsername] = useState('');
    const [regist_email, setRegistEmail] = useState('');
    const [regist_password1, setRegistPassword1] = useState('');
    const [regist_password2, setRegistPassword2] = useState('');

    const history = useHistory();
    const Register = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${api_url}/users`, {
                name: regist_username,
                email: regist_email,
                password: regist_password1,
                confPassword: regist_password2
            });
            setRegist("");
            history.push("/");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    const [isRegist, setRegist] = useState(false)
    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api_url}/login`, {
                username: email,
                password: password,
            });
            // const decode = jwt_decode(response.data);
            const usertype = response.data[1].usertype;
            const userid = response.data[1].id;
            const username = response.data[1].username; 
            sessionStorage.setItem('cid',   response.data[1].id);
            sessionStorage.setItem('cname', response.data[1].username);
            sessionStorage.setItem('ctype', response.data[1].usertype);
            goPage(userid, username, usertype);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    const loginDemo = () => {
        // e.preventDefault();
        const usertype = 0;
        const userid = 1;
        const username = 'Demo'; 
        sessionStorage.setItem('cid',   userid);
        sessionStorage.setItem('cname', username);
        sessionStorage.setItem('ctype', usertype);
        goPage(userid, username, usertype);
    }

    
    const goPage = (userid, username, usertype ) => {
        if(userid>0 && username ){
            if(usertype == 0) {
                history.push("/client/",{username,usertype,userid});
            }
            else {
                history.push("/dashboard/",{usertype,userid,username} )
            };
        }
    }
    let userid = sessionStorage.getItem('cid')
    let username   = sessionStorage.getItem('cname')
    let usertype = sessionStorage.getItem('ctype')
    if(userid && username && usertype)
        goPage(userid, username, usertype);
    
    if(isRegist)
    {
        return(
            <div className="index-container brown-image">
                <img src={logo} alt="Logo" className="logo-image"/>
                <div className="login-container">
                    <form  onSubmit={Register} autoComplete="false" className="form-container">
                        <p className="welcome">Sign Up</p>
                        
                        <div className="inputrow  row-first dblock">
                            <ImUserPlus className="signIcon"/>
                            <input type="text"  placeholder="Username" value={regist_username} onChange={(e) => setRegistUsername(e.target.value)}/>
                        </div>
                        <div className="inputrow dblock">
                            <MdAttachEmail className="signIcon"/>
                            <input type="text"  placeholder="client@dualnet.com" value={regist_email} onChange={(e) => setRegistEmail(e.target.value)} />
                        </div>
                        
                        <div className="inputrow dblock div-input-eye">
                            <RiLockPasswordFill className="signIcon"/>
                            <input type={showpassword?"text":"password"}  placeholder="Type your Password" value={regist_password1} onChange={(e) => setRegistPassword1(e.target.value)} />
                            {showpassword?<AiFillEye className="eye-rgistpassword-visible" onClick={()=>{  setShowpassword(false)}}/>
                                            :<AiFillEyeInvisible className="eye-rgistpassword-visible" onClick={()=>{  setShowpassword(true)}}/>}
                        </div>
                        <div className="inputrow dblock div-input-eye">
                            <IoKeySharp className="signIcon"/>
                            <input type={showpassword?"text":"password"}  placeholder="Type your Password" value={regist_password2} onChange={(e) => setRegistPassword2(e.target.value)} />
                            {showpassword?<AiFillEye className="eye-rgistpassword-visible" onClick={()=>{  setShowpassword(false)}}/>
                                            :<AiFillEyeInvisible className="eye-rgistpassword-visible" onClick={()=>{  setShowpassword(true)}}/>}
                        </div>
                        <div id="button" className="inputrow dblock mt-5" >
                            <button >Sign Up</button>
                        </div>
                        <p className="text-invalid">{msg}</p>
                        <p className="guider"> Try <span className="try-demo" onClick={()=>loginDemo()}>Demo Account</span> Or <span className="register" onClick={()=>{setRegist(false)}}>Log in</span> </p>
                    </form>
                    <div className="imagediv-login">
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
                    <form autoComplete="off" onSubmit={Auth} className="form-container">
                        <p className="welcome">Welcome</p>
                        <p className="dualnet">Dualnet Client</p>
                        
                        <div className="row  row-first">
                            <label >UserName or Email</label>
                            <input type="text"  placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="row">
                            <label id="passwordlabel">Enter your password</label>
                            
                            <div className="div-input-eye">
                                <input type={showpassword?"text":"password"}  placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {showpassword?<AiFillEye className="eye-visible" onClick={()=>{  setShowpassword(false)}}/>
                                             : <AiFillEyeInvisible className="eye-visible" onClick={()=>{  setShowpassword(true)}}/> }
                            </div>
                        </div>
                        <div id="button" className="row">
                            <button >log in</button>
                        </div>
                        <p className="text-invalid">{msg}</p>
                        <p className="guider"> Try <span className="try-demo" onClick={()=>loginDemo()} >Demo Account</span> &nbsp;Or <span className="register" onClick={()=>{setRegist(true)}}>Registration</span> </p>
                    </form>
                    <div className="imagediv-login">
                    </div>
                </div>
            </div>
        );      
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
}

export default LogIn;


