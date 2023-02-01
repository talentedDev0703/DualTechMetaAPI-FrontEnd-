import React, { useState } from "react";
import $, { map } from "jquery";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import  UserListToolTip from "../ToolTips/userListToolTip";
import ExclaimIconToolTip from "../ToolTips/exclaimIconToolTip";
import {FcComboChart} from 'react-icons/fc';
import { MdCircle } from "react-icons/md";
import "./Dashboard.css";
import logo from '../../assets/logo.svg';
import Alertbox from "../investment/alert";
import { getClients, getSocket, logout} from '../../api/api';
import AccountInfo from "../common/accountInfo";

const io = getSocket;

const Dashboard = () =>{
	const location = useLocation();
	const userid =  (location.state.userid)?(location.state.userid):(sessionStorage.getItem('cid'));
	const username =  location.state.username?location.state.username:(sessionStorage.getItem('cname'));
	const usertype =  location.state.usertype?location.state.usertype:(sessionStorage.getItem('ctype'));
	console.log(location.state);

	const [name, setName] = useState('');
	const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
	const [userName, setUsername] = useState(username);
    const history = useHistory();
	const [users,setUsers] = useState([]);
	const [data,setData] = useState('');
	const axiosJWT = axios.create();
	const investmentAmount = "40000";
	const [alertpip, setPipalert] = useState(100);
	const lang = "en-US";
	const numberCurrency0 = {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: "0"
	}

	const setAlertpip = (event) => {
		if((event.target.value<1000) && (event.target.value>=0))
		setPipalert(event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'));
	}

	const goAdmin = async () => {
		const admin = 'admin'
        try {
            history.push('/admin',{admin,usertype,userid,username});
        } catch (error) {
            console.log(error);
        }
    }

	const RetrieverDataProcess = async () => {
		let userdata = await getClients(userid,usertype);
		return userdata;
	}

	useEffect(() => {
		//refreshToken();
		io.connect();
		RetrieverDataProcess().then((result)=>{
			setUsers(result);
			console.log('dashboard--', result);
			let arr_users = [];
			arr_users.push(userid);
			for (let index = 0; index < result.length; index++) {
				arr_users.push(result[index].id);
			}
			console.log('agentinfo- socket request');
			io.emit('agentInfo', arr_users);
		});

		io.on('response', response => {
			let res = JSON.parse(response);
			console.log('agentinfo=', res)
			if(res.type === 'agentInfo'){
				let arr = res.data;
				// console.log('agentinfo', arr);
				setData(arr);
			}
		});
		io.on("disconnect", (reason) => {
			if (reason === "io server disconnect") {
			  // the disconnection was initiated by the server, you need to reconnect manually
			  	io.connect();
			}
			// else the socket will automatically try to reconnect
		});
		return () => {
			io.disconnect();
			io.off('response');
			io.off('disconnect');
		};
	}, []);

	const refreshToken = async () => {
		try {
			const response = await axios.get('/token');
			setToken(response.data.accessToken);
			const decoded = jwt_decode(response.data.accessToken);
			setName(decoded.name);
			setExpire(decoded.exp);
		} catch (error) {
			if (error.response) {
				history.push("/");
			}
		}
	}

	return (
		<div className="index-container brown-image">
            <img src={logo} alt="Logo" className="logo-image"/>
			<div className="investment-container">
				<div className="User-inf1">
					<div className="Dashboard">Dashboard</div>
					<div className="adf">
						<div className="header-user">
							<p className="dashboard-username">{userName}</p>
							<p className="dashboard-investmount">Investment: {Number(investmentAmount).toLocaleString(lang, numberCurrency0)}</p>
						</div>
					<div className="Ag-usertype">{usertype==1?'Agent':'Admin'}</div>
						<div className="float-left">
							<button  className="button-logout" onClick={()=>logout(history)}>LOGOUT</button>
							{ (usertype == 2)?<button  className="button-logout" onClick={goAdmin}>ADMIN</button>:'' }
						</div>
					</div>	
				</div>
				<AccountInfo userInfo={{id:userid, username: username, usertype:usertype}} reward={data[userid]?data[userid][0]:{}} hedge={data[userid]?data[userid][1]:{}} isShowUses={1} userList={users} agentInfo={{id:userid, name: username, type:usertype}} />
				<div className="client_list"> 
				{users.map((item,i)=>{
					return(
						<div>
							<div className="dashboard-user">
								<span className="dashboard-username">{item.prename} {item.lastname} </span>
								<span className="Cl-usertype">{(item.usertype == 0)?'Client':'Agent'} </span>
								<span className="dashboard-investmount">{item.username} </span>
							</div>
							<AccountInfo key={'c-'+i} userInfo={item} reward={data[item.id]?data[item.id][0]:{}} hedge={data[item.id]?data[item.id][1]:{}} agentInfo={{id:userid, name: username, type:usertype}} />
						</div>
					);
				})
				}
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
