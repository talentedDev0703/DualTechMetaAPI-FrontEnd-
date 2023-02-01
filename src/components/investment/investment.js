import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ImArrowLeft, ImArrowRight, ImArrowUp, ImArrowDown } from "react-icons/im";
import Swal from 'sweetalert2'
import $ from 'jquery';
// custom module
import "./investment.css";
import logo from '../../assets/logo.svg';
import { MdDashboard, MdCircle } from "react-icons/md";
import TradeListToolTip from "../ToolTips/tradeListToolTip";
import ExclaimIconToolTip from "../ToolTips/exclaimIconToolTip";
import Chart from "../TickHistoryChart/chart"
import Alertbox from "./alert";
import {BrownSquare, BlueSquare, GreenSquare, OrangeSquare, GelbSquare, PastelblueSquare, 
		EmptySquare, PastelgreenSquare, PastelorangeSquare, PastelgelbSquare} from './square';
import { getMetaAccounts, getInvestment, setSkrillwallet, getSkrillwallet, logout, getSocket, getCurrencyInfo, api_url } from '../../api/api.js';
import {HiChevronDown, HiChevronUp} from "react-icons/hi"
import {FiCheckSquare} from "react-icons/fi";

// for testing
import fakeaccountinfo from '../Jsondata/account-data.json';

let accounIds = [];
let arrStopout = [];
let isTrading = 0;
let isStopoutAlert = 0;
const io = getSocket;

function InvestmentComponent() {

	const location 	= useLocation();
    const history 	= useHistory();
	const userid 	= location.state.userid;
	const username 	= location.state.username;
	const agentname = location.state.agentname;
	const agentid 	= location.state.agentid;
	const usertype 	= location.state.usertype?location.state.usertype:(sessionStorage.getItem('ctype'));
	const [award, setAward] = useState('');
	const [hedge, setHedge] = useState('');
	const [currencyType,  setCurrencyType ] = useState('USDMXN');
	const [investmentAmount, setInvestment] = useState(0);
	const [skrill, setSkrill] = useState(0);
	const [arrCurrency, setArrCurrency] = useState({});
	const [swapamount, setSwapamount] = useState([0,0]);
	const [openPriceRange, setOpenPriceRange] = useState([0, 0]);
	const [spreadNow, setSpreadNow] = useState(0);
	const [arrtransfer, setArrTransfer] = useState([0,0]);
	const [high_liquid, setHigh_liquid] = useState(0);
	const [low_liquid, setLow_liquid] = useState(0);
	const [stopOutFlag, setStopOutFlag] = useState(0);
	const [orders,setOrders] = useState({
		rewards: [],
		hedges: []
	});
    const [user,setUser] = useState("User-inf1");
    const [border,setBorder] = useState("investment-container");
	const [backcolor, setBackcolor] = useState("index-container brown-image");
	const [colorindex, setColorindex] = useState(0);
	const [isOpenAlertOn, setOpenAlertOn] = useState(0);
	// auto open and close trade flag
	const [isOpenTradeOn, setOpenTradeOn] = useState(0);
	const [isCloseTradeOn, setCloseTradeOn] = useState(0);
	const [isHighTradeVisible, setHighTradeVisible] = useState(0);
	const [isLowTradeVisible, setLowTradeVisible] = useState(0);
	const [isSmallTradeVisible, setSmallTradeVisible] = useState(1);
	const [isBigTradeVisible, setBigTradeVisible] = useState(1);
	const [openSpread, setOpenSpread] = useState(350);
	const [closeSpread, setCloseSpread] = useState(350);
	const [minPip, setMinPip] = useState(400);
	const [devPip, setDevPip] = useState(10);
	const [lotSize, setLotSize] = useState(0.01);
	const [isLeftArrowOn, setLeftArrowOn] = useState(0);
	const [isRightArrowOn, setRightArrowOn] = useState(0);
	const [isTopArrowOn, setTopArrowOn] = useState(1);
	const [isBottomArrowOn, setBottomArrowOn] = useState(1);
	
	const lang = "en-US";
	const numberCurrency0 = {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: "0"
	}
	const iscritical = (transfer)=>{
		if(transfer<0) return "text-red";
		else return "";
	}

	const lotSizeUp = () =>{
		setLotSize(lotSize + 0.01);
	}
	const lotSizeDown = () =>{
		if(lotSize<0.01) {}
		else{ setLotSize(lotSize - 0.01); } 	
	}
	const colorPanelOnclick = (img, i) =>{
		setBackcolor('index-container '+ img+'-image');
		setColorindex (i);
		(img === 'brown')?setUser("User-inf1"):setUser("User-inf");
		(img === 'brown')?setBorder("investment-container"):setBorder("investment-container1");
	};

	const setOpenAlert=()=>{ isOpenAlertOn?setOpenAlertOn(0):setOpenAlertOn(1) };
	const setOpenTrade=()=>{ isOpenTradeOn?setOpenTradeOn(0):setOpenTradeOn(1) };
	const setCloseTrade=()=>{ isCloseTradeOn?setCloseTradeOn(0):setCloseTradeOn(1) };
	const setHighTradeVisibleHandler=()=>{ isHighTradeVisible?setHighTradeVisible(0):setHighTradeVisible(1) };
	const setLowTradeVisibleHandler=()=>{ isLowTradeVisible?setLowTradeVisible(0):setLowTradeVisible(1) };
	const setSmallTradeVisibleHandler =()=>{ isSmallTradeVisible?setSmallTradeVisible(0):setSmallTradeVisible(1)};
	const setBigTradeVisibleHandler=()=>{ isBigTradeVisible?setBigTradeVisible(0):setBigTradeVisible(1) };
	const setLeftArrow=()=>{ isLeftArrowOn?setLeftArrowOn(0):setLeftArrowOn(1) };
	const setRightArrow=()=>{ isRightArrowOn?setRightArrowOn(0):setRightArrowOn(1) };
	const setTopArrow =()=>{ isTopArrowOn?setTopArrowOn(0):setTopArrowOn(1)};
	const setBottomArrow=()=>{ isBottomArrowOn?setBottomArrowOn(0):setBottomArrowOn(1) };
	const handleStopoutFlag = (flag) => { isStopoutAlert = flag;}

	const setLotValue = (event) => {
		if(event.target.value === ''){
			setLotSize(0.1);
		}
		if((event.target.value<1000) && (event.target.value>=0))
			setLotSize(event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1').toLocaleString(lang,''));
	}

	const setOpenSpreadValue = (event) => {
		if(event.target.value>=0)
			setOpenSpread(event.target.value);
	}

	const setCloseSpreadValue = (event) => {
		if(event.target.value>=0)
			setCloseSpread(event.target.value);
	}

	const setMinPipValue = (event) => {
		if(event.target.value>=0)
			setMinPip(event.target.value);
	}
	
	const setDevPipValue = (event) => {
		if(event.target.value>=0)
			setDevPip(event.target.value);
	}

	const setSkrillValue = (event) => {
		if(event.target.value>=0){
			setSkrillwallet(userid, event.target.value);
			setSkrill(event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'));
		}
	}

	const verifyVal = (obj, key, datatype = 'N')=>{
		if(!obj || !obj[key]) return (datatype==='N'?0:' ');
		return obj[key];
	}

	// sum property value of objects in Object array
	const sum = function(items, prop){
		return items.reduce( function(a, b){
			return a + b[prop];
		}, 0);
	};

	const setCurrencyName = (symbol) => {
		setCurrencyType(symbol);
	}

	// sort object by property value in Object array
	const objectSort = ( a, b ) => {
		if ( a.time > b.time ){
		  return -1;
		}
		if ( a.time < b.time ){
		  return 1;
		}
		return 0;
	}

	const autoOpenTrade = (pip1, pip2) => {
		let totalPip = pip1+pip2;
		let deviation = Math.abs((pip1 - pip2)*100/totalPip);
		if(isOpenTradeOn && deviation<devPip && totalPip>minPip && Number(spreadNow)<Number(openSpread)){
			openTrading();
		}
	}

	const autoCloseTrade = () =>{
		if(isCloseTradeOn && spreadNow<closeSpread){
			const {rewards, hedges} = orders;
			if(rewards.length>0 && hedges.length>0){
				for(let i=0; i<rewards.length; i++){
					if(rewards[i].openPrice === openPriceRange[0] && hedges[i].freepip){
						closeTrading(rewards[i].id, hedges[i].id);
					}
				}
			}
			
		}
	}

	const openTrading = (type='both') =>{
		console.log('openTrading------', type);
		if(lotSize === 0){
			sweatAlert('warning', 'Lot size is zero!')
			return;
		}
		if(type === 'both'){
			if((verifyVal(award, 'login', 'S')) === '' || (verifyVal(hedge, 'login', 'S')) === ''){
				sweatAlert('warning', 'Please check accounts state again!')
				return;
			}
		}else if(type === 'reward'){
			if((verifyVal(award, 'login', 'S')) === '' ){
				sweatAlert('warning', 'Please check reward accounts state again!')
				return;
			}
		}else if(type === 'hedge'){
			if((verifyVal(hedge, 'login', 'S')) === '' ){
				sweatAlert('warning', 'Please check hedge accounts state again!')
				return;
			}
		}
		let obj = {
			type: type,
			lotsize: lotSize,
			currency: currencyType,
			rewardID: accounIds[0],
			hedgeID: accounIds[1]
		}
		isTrading = 1;
		io.emit('openTrade', obj);
	}

	const closeTrading = (pos_id1, pos_id2) => {
		console.log('fun-closeTrading');
		let obj = {
			pos_id1: pos_id1, 
			pos_id2: pos_id2, 
			accountId: accounIds[0], 
			accountId2: accounIds[1]
		}
		isTrading = 1;
		io.emit('closeTrade', obj);
	}

	const sweatAlert = (type, text) =>{
		Swal.fire({
			title: 'Report',
			text: text,
			icon: type,
			confirmButtonText: 'OK'
		})
	}

	const handleCurrency = () =>{
		let val = $('#currency-input').val();
		setCurrencyType(val);
		io.emit('getData', '', accounIds, val, 1000);
	}

	const getPriceRange = (arrObj, key) => {
		let min = 0;
		let max = 0;
		arrObj.forEach(obj => {
			let num = obj[key];
			if(obj['symbol'] === currencyType)
			{
				if(max === 0){
					max = num;
					min = num;
				}else{
					max = num>max?num:max;
					min = num<min?num:min;
				}
			}	
		});
		setOpenPriceRange([max, min]);
	}
	
	useEffect(() => {
		io.connect();
		getMetaAccounts(userid).then((result)=>{
			console.log('getMetaAccounts---------',result.data)
			accounIds = result.data.arrInfo;
			arrStopout = result.data.arrStopout;
			if(accounIds.length>0)
				getSwap(accounIds[0]);
			let socketid = usertype>0?agentid:userid;
			io.emit('getData', socketid, accounIds, currencyType, 1000);
	  	});
		getInvestment(userid).then((result)=>{
			let data = result.data;
			setInvestment(data[0].investment);
		});
		getSkrillwallet(userid).then((result)=> {
			let data = result.data;
			setSkrill(data[0].skrill_wallet);
		});
		
		io.on("disconnect", (reason) => {
			if (reason === "io server disconnect") {
			  	io.connect();
			}
		});
		return () => {
			io.disconnect();
			io.off('disconnect');
			io.off('response');
		};
	},[]);

	useEffect(()=>{

		io.on('response', response => {
			let res = JSON.parse(response);
			// let res = fakeaccountinfo;
			if(res.type === 'accountInfo'){
				let data = res.data;
				let orders = {
					rewards: [],
					hedges: []
				};
				let positions = [];
				if (data[0]) {
					orders.rewards = (data[0].orders).sort(objectSort);
					positions = data[0].orders;
					data[0]['sumlot'] = sum(data[0].orders, 'volume');
					// console.log('freemargin1', data[0]['freeMargin']);
					data[0]['freeMargin'] = data[0]['freeMargin'] + data[0]['margin'] * arrStopout[0];
					// console.log('freemargin2', data[0]['freeMargin']);
					data[0]['freepip'] = (data[0]['sumlot'] != 0)?Number((data[0]['freeMargin']/10)/data[0]['sumlot']):0;
					let price_obj = data[0]['prices'];
					if(price_obj){
						let low = Number(price_obj['ask']).toFixed(4)-Number((data[0]['freepip'] * price_obj['ask']/10000).toFixed(4));
						setLow_liquid(low.toFixed(4))
					}
				}
				if (data[1]) {
					orders.hedges = (data[1].orders).sort( objectSort ); 
					data[1]['sumlot'] = sum(data[1].orders, 'volume');
					data[1]['freeMargin'] = data[1]['freeMargin'] + data[1]['margin'] * arrStopout[1];
					data[1]['freepip'] = (data[1]['sumlot'] != 0)?Number((data[1]['freeMargin']/10)/data[1]['sumlot']):0;
					let price_obj2 = data[1]['prices'];
					if(price_obj2){
						let high = Number(price_obj2['bid']+(data[1]['freepip'] * price_obj2['bid']/10000));
						setHigh_liquid(high.toFixed(4));
					}
					if(positions.length === 0){
						positions = data[1].orders;
					}
				}
				if(data[0] && data[1] && isTrading === 0){
					autoOpenTrade(data[0]['freepip'], data[1]['freepip']);
					autoCloseTrade();
					var diff_freemargin = (verifyVal(data[0], 'freeMargin')) - (verifyVal(data[1], 'freeMargin'));
					let transfer1 = (-1*diff_freemargin/2).toFixed();
					let transfer2 = (diff_freemargin/2).toFixed();
					setArrTransfer([transfer1, transfer2]);
					if(data[0].sumlot !== data[1].sumlot && isStopoutAlert===1){
						setStopOutFlag(1);
						stopOutFunc(orders.rewards, orders.hedges);
					}
				}
				
				let spread = ((((data[0] && data[0].prices)?(verifyVal(data[0].prices, 'ask')).toFixed(5)-(verifyVal(data[0].prices, 'bid')).toFixed(5):0)+((data[1] && data[1].prices)?(verifyVal(data[1].prices, 'ask')).toFixed(5)-(verifyVal(data[1].prices, 'bid')).toFixed(5):0))*100000).toFixed(0);
				setSpreadNow(spread);
				setAward(data[0]?data[0]:{});		// reward account information
				setHedge(data[1]?data[1]:{});		// hadge  account information
													// sort by open date with DESC
				setOrders(orders);					// total position list of reward and hedge account
				if(accounIds.length>0 && swapamount == 0){
					getSwap(accounIds[0]);			// get swap information by reward account.
				}
				getPriceRange(positions, 'openPrice');
			}else if(res.type === 'opentrade') {
				let data = res.data;
				if(data == 1)
					sweatAlert('success', 'opening trade successful!')
				else
					sweatAlert('error', 'failed to open trade!')
				isTrading =  0;
			}else if(res.type === 'closetrade') {
				let data = res.data;
				if(data == 1)
					sweatAlert('success', 'closing trade successful!')
				else
					sweatAlert('error', 'failed to close trade!') 
				isTrading =  0;
			}else if(res.type === 'closeGroupTrade'){
				let data = res.data;
				if(data == 1)
					sweatAlert('success', 'closing individual trade successful!')
				else
					sweatAlert('error', 'failed to Stopout!');
				isTrading =  0;
			}
		});
	},[])

	const getSwap = (accountid) => {
		if(accountid === undefined || accountid === '') return;
		getCurrencyInfo(accountid, currencyType).then((res)=>{
			if(res.data !== null) {
				let currency_obj = res.data.info;
				let price = res.data.price;
				setArrCurrency(currency_obj);
				let swaplong = (verifyVal(price, 'ask'))!=0?Number(currency_obj.swapLong/(verifyVal(price, 'ask'))).toFixed(1): 0;
				let swapshort = (verifyVal(price, 'ask'))!=0?Number(currency_obj.swapShort/(verifyVal(price, 'ask'))).toFixed(1): 0;
				setSwapamount([swaplong, swapshort]);
			}
		})
	}

	const stopOutFunc = (e, order1, order2) => {
		e.preventDefault();
		console.log('fun-stopOutFunc');
		let removePostions1 = [];
		let removePostions2 = [];
		let arrOrder2 = order2;
		if(order1.length===0 || order2.length===0){
			return;
		}
		isTrading = 1;
		for(let i=0; i<order1.length; i++){
			let j = 0;
			while(j<arrOrder2.length){
				if(order1[i].comment === arrOrder2[j].comment  && order1[i].type !== arrOrder2[j].type){ //
					arrOrder2[j].volume = 0;
					break;
				}
				if(j===(arrOrder2.length-1)){
					removePostions1.push(order1[i].id);
				}
				j++;
			}
		}
		for(let k=0; k<arrOrder2.length; k++){
			if(arrOrder2[k].volume > 0)
				removePostions2.push(arrOrder2[k].id);
		}

		if(removePostions1.length>0 || removePostions2.length>0){
			let obj = {
				pos_ids1: removePostions1, 
				pos_ids2: removePostions2, 
				accountId: accounIds[0], 
				accountId2: accounIds[1]
			}
			console.log('socket-closeGroupTrade', obj);
			io.emit('closeGroupTrade', obj);
		}
	}
	

	return (
		<div className={backcolor}>
            <img src={logo} alt="Logo" className="logo-image"/>
			<div className={border}>
			<div className="User-inf1">
				<Alertbox pip={[verifyVal(award, 'freepip'), verifyVal(hedge, 'freepip')]}  margin={[verifyVal(award, 'freeMargin'), verifyVal(hedge, 'freeMargin')]}  spread={spreadNow} handleStopoutFlag={handleStopoutFlag} stopOutFlag={stopOutFlag} />
				<div className="Dashboard">Dashboard</div>
				<div className="adf">
					<div className="invest-user">
						<p className="dashboard-username">{username}</p>
						<p className="dashboard-investmount">Investment: {(investmentAmount)?Number(investmentAmount).toLocaleString(lang, numberCurrency0):''}</p>
					</div>
					<div className="Ag-usertype">{usertype==1?'Agent':usertype==2?'Admin':'Client'}</div>
					<div>
						<button  className="button-logout" onClick={()=>logout(history)}>LOGOUT</button>
					</div>
				</div>	
            </div>
				<div className="finance-inf">
					<div>
						<p className="text-wallet">Wallet</p>
						<span><MdCircle className={(award && award.login)?"icon-green icon-state icon-wallet": "icon-red icon-state icon-wallet"}/></span>
						<span>Reward</span>
						<br />
						<span><MdCircle className={(hedge && hedge.login)?"icon-green icon-state icon-wallet": "icon-red icon-state icon-wallet"}/></span><span>Hedge</span>
					</div>
					<div className="border-right" />
					<div>
						<p>Account No.</p>
						<p>{verifyVal(award, 'login')}</p>
						<p>{verifyVal(hedge, 'login')}</p>
					</div>
					<div className="border-right" />
					<div>
						<p>Balance</p>
						<p>{(verifyVal(award, 'balance')).toFixed()}</p>
						<p>{(verifyVal(hedge, 'balance')).toFixed()}</p>
					</div>
					<div className="border-right" />
					<div>
						<p>Equity</p>
						<p>{Number(verifyVal(award, 'equity')).toFixed()}</p>
						<p>{Number(verifyVal(hedge, 'equity')).toFixed()}</p>
					</div>
					<div className="border-right" />
					<div>
						<p>Lot</p>
						<p>{Number(verifyVal(award, 'sumlot')).toFixed(2)}</p>
						<p>{Number(verifyVal(hedge, 'sumlot')).toFixed(2)}</p>
					</div>
					<div className="border-right" />
					<div>
						<p>Trades</p>
						<p>{verifyVal(award, 'trades')}</p>
						<p>{verifyVal(hedge, 'trades')}</p>
					</div>
					<div className="border-right" />
					<div>
						<p>Free Pip</p>
						<p>{Number(verifyVal(award, 'freepip')).toFixed().toLocaleString(lang,'')}</p>
						<p>{Number(verifyVal(hedge, 'freepip')).toFixed().toLocaleString(lang,'')}</p>
					</div>
					<div className="border-right" />
					<div>
						<p>Free Margin</p>
						<p>{Number(verifyVal(award, 'freeMargin')).toFixed().toLocaleString(lang,'')}</p>
						<p>{Number(verifyVal(hedge, 'freeMargin')).toFixed().toLocaleString(lang, '')}</p>
					</div>
					<div className="border-right" />
					<div>
						<div className="transferTitle relative">
							<div>
								<p>Transfer</p>
							</div>
							<span style={{position:'absolute', right:-15, top:0}}><ExclaimIconToolTip  /></span>
						</div>
						<p className={iscritical(arrtransfer[0])}><span>{(Number(arrtransfer[0])<0)?'':'+'}</span>{arrtransfer[0]}</p>
						<p className={iscritical(arrtransfer[1])}><span>{(Number(arrtransfer[1])<0)?'':'+'}</span>{arrtransfer[1]}</p>
					</div>
					<div className="border-right" />
					<div>
						<p>Skrill Wallet</p>
						<p><input className="text-right" onChange={setSkrillValue}  style={{width:'51px', fontSize: '0.9rem'}} value={Number(skrill)} /></p>
					</div>
					<div className="border-right" />
					<div>
						<p>Total Wallets</p>
						<p>{(award)?Number((verifyVal(award, 'equity'))+(verifyVal(hedge, 'equity'))+Number(!isNaN(skrill)?skrill:0)).toFixed().toLocaleString(lang,numberCurrency0):'0'}</p>
					</div>
					{
						(agentname && usertype>0)? <MdDashboard className="Compactdown icon-toDashboard" onClick={(e)=>{
							history.push("/dashboard/",{usertype:usertype,userid:agentid,username:agentname})
						}}/>: <></>
					}	
				</div>
				<div className="chart">
					<div className="chart-controlpanel">
						<div className="opentradepanel float-left">
							<div className="opentrade">
								{/* <div className="tradecontrolpanel">
									<div>
										{isOpenAlertOn? <MdCircle className="icon-green icon-state ml-2 mb-3" onClick={setOpenAlert}/>: <MdCircle className="icon-red icon-state ml-2 mb-10" onClick={setOpenAlert}/>}		
										<br/>
										<br/>
									</div>
									<div>
										<p className="mt1">Open by spread</p>
										<p className="mt1">Minimum pip total</p>
										<p className="mt1">Deviation pip(%)</p>
									</div>
									<div className="nomargin">
										<p className="mt1">&lt;</p>
										<p className="mt1">&gt;</p>
										<p className="mt1">&lt;</p>
									</div>
									<div className="panelautomargin">
										<input className="input-style" type="number" value ={openSpread} onChange={setOpenSpreadValue}/>
										<input className="input-style" type="number" value ={minPip} onChange={setMinPipValue}/>
										<input className="input-style" type="number" value ={devPip} onChange={setDevPipValue}/><span></span>
									</div>
								</div>
								<input className="spread-red" value = {spread} disabled/>
								<input className="Lot-grey"  onChange={setLotValue} value = {lot} maxLength = "5"/> */}
								<div className="tradecontrolpanel">
									<div className="openbyspread">
										{isOpenTradeOn? <MdCircle className="icon-green icon-state ml-2 mb-11" onClick={setOpenTrade}/>: <MdCircle className="icon-red icon-state ml-2 mb-11" onClick={setOpenTrade}/>}		
										{isCloseTradeOn? <MdCircle className="icon-green icon-state ml-2 mb-11" onClick={setCloseTrade}/>: <MdCircle className="icon-red icon-state ml-2 mb-11" onClick={setCloseTrade}/>}		
									</div>
									<div>
										<p className="mt1">Open by spread</p>
										<p className="mt1">Close by spread</p>
									</div>
									<div className="nomargin">
										<p className="mt1">&lt;</p>
										<p className="mt1">&lt;</p>
									</div>
									<div className="panelautomargin-small">
										<input className="input-style" type="number" value ={openSpread} onChange={setOpenSpreadValue}/>
										<input className="input-style" type="number" value ={closeSpread} onChange={setCloseSpreadValue}/>
									</div>
									<div className="nomargin">
										<span className="mt1" style={{color: '#b8b8b8'}}>If pip totally &gt; </span><input className="input-style" type="number" value ={minPip} onChange={setMinPipValue}/>&nbsp;&nbsp;
										<span className="mt1" style={{color: '#b8b8b8'}}>Deviation pip% &lt; </span><input className="input-style" type="number" value ={devPip} onChange={setDevPipValue}/>&nbsp;&nbsp;	
									</div>
								</div>
								<div className="trade-button bg-green">
									<div className="tickprice">
										<span className="textup">{(award.prices)?(verifyVal(award.prices, 'bid')).toFixed(5):0}</span>
										<span className="font-Italic">{(award.prices)?(verifyVal(award.prices, 'ask')).toFixed(5):0}</span>
									</div>
									<div className="VerticalLine"/>
									<span className="text-sellbuy" onClick={()=>openTrading('reward')}>Sell</span>
								</div>
								<div>
									<div className="currency-div">
										<input className="unknown-gradient" defaultValue={'USDMXN'} id="currency-input"/>
										<span><FiCheckSquare className="check-currency-btn" onClick={handleCurrency} /></span>
									</div>
									<div className="lot-div">
										<HiChevronDown className="lotupdown" onClick={lotSizeDown}/>
										<input className="unknown-gradient" value = {lotSize} onChange={(event)=>setLotSize(event.target.value)}/>
										<HiChevronUp className="lotupdown" onClick={lotSizeUp}/>
									</div>
								</div>
								<div className="trade-button bg-green">
									<span className="text-sellbuy" onClick={()=>openTrading('hedge')}>Buy</span>
									<div className="VerticalLine"/>
									<div className="tickprice">
										<span  className="textup">{(hedge.prices)?(verifyVal(hedge.prices, 'ask')).toFixed(5):0}</span>
										<span className="font-Italic">{(hedge.prices)?(verifyVal(hedge.prices, 'bid')).toFixed(5):0}</span>
									</div>
								</div>
								<div onClick={()=>openTrading()}><input className="Spreadinput"  value = {spreadNow} disabled/></div>
								
							</div>
						</div>
						<div className="color-panel float-left">
							<div className="color-panel-row">
								<BrownSquare handler={colorPanelOnclick} /> 
								<BlueSquare handler={colorPanelOnclick} /> 
								<GreenSquare handler={colorPanelOnclick} /> 
								<OrangeSquare handler={colorPanelOnclick} /> 
								<GelbSquare handler={colorPanelOnclick} /> 
							</div>
							<div className="color-panel-row">
								<EmptySquare />
								<PastelblueSquare handler={colorPanelOnclick} /> 
								<PastelgreenSquare handler={colorPanelOnclick} /> 
								<PastelorangeSquare handler={colorPanelOnclick} /> 
								<PastelgelbSquare handler={colorPanelOnclick} />
							</div>
						</div>
						{/* <div className="chart-option">
							<p> Selected trades</p>
							<div>
								{isLeftArrowOn? <ImArrowLeft className="ml-2 icon-state" onClick={setLeftArrow}/>: 	<ImArrowLeft className="ml-2 icon-green icon-state" onClick={setLeftArrow}/>}
								{isRightArrowOn? <ImArrowRight className="ml-2 icon-state" onClick={setRightArrow}/>: 	<ImArrowRight className="ml-2 icon-green icon-state" onClick={setRightArrow}/>}
								{isBottomArrowOn? <ImArrowDown className="ml-2 icon-state" onClick={setBottomArrow}/>: 	<ImArrowDown className="ml-2 icon-green icon-state" onClick={setBottomArrow}/>}
								{isTopArrowOn? <ImArrowUp className="ml-2 icon-state mbo-3" onClick={setTopArrow}/>: 	<ImArrowUp className="ml-2 icon-green icon-state mbo-3" onClick={setTopArrow}/>}
							</div>
						</div> */}
					</div>
					 <Chart index={colorindex}  />{ /*setCurrencyName={setCurrencyName} */}
					<div className="symbol-inf">
						<div>
							<TradeListToolTip orders = {orders} closeTrading={closeTrading} />
							<div className="float-right">
								<div>
									<span>interest :
									</span>
								</div>
								<div>
									<span>1 Day</span>
								</div>
								<div>
									<span className="text-green">{(swapamount[1]>0)?Number(swapamount[1]*(verifyVal(award, 'sumlot'))).toFixed(1):0}</span>
									<br />
									<span className="text-green">{(investmentAmount>0)?(swapamount[1]*(verifyVal(award, 'sumlot'))*100/investmentAmount).toFixed(2):0}%</span>
								</div>
								<div>
									<span>1 Week</span>
								</div>
								<div>
									<span className="text-green">{(swapamount[1]>0)?(swapamount[1]*(verifyVal(award, 'sumlot'))*7).toFixed(1):0}</span>	
									<br />
									<span className="text-green">{(investmentAmount>0)?(7*swapamount[1]*(verifyVal(award, 'sumlot'))*100/investmentAmount).toFixed(2):0}%</span>
								</div>
								<div>
									<span>1 Month</span>
								</div>
								<div>
									<span className="text-green">{(swapamount[1]>0)?(swapamount[1]*(verifyVal(award, 'sumlot'))*30).toFixed(1):0}</span>
									<br />
									<span className="text-green">{(investmentAmount>0)?(30*swapamount[1]*(verifyVal(award, 'sumlot'))*100/investmentAmount).toFixed(2):0}%</span>
								</div>
								<div>
									<span>1 year</span>
								</div>
								<div>
									<span className="text-green">{(swapamount[1]>0)?(swapamount[1]*(verifyVal(award, 'sumlot'))*365).toFixed(1):0}</span>
									<br />
									<span className="text-green">{(investmentAmount>0)?(365*swapamount[1]*(verifyVal(award, 'sumlot'))*100/investmentAmount).toFixed(2):0}%</span>
								</div>
							</div>	
							<div className="float-right" style={{display: "block", marginRight: "10px"}}>
								<div>
									<span className="swap-amount">Swap Long 1 lot : </span>
									<span className="swap-amount">{Number(verifyVal(arrCurrency, 'swapLong')) + ` (${Number(swapamount[0])})`}</span>
								</div>
								<div>
									<span className="swap-amount">Swap Short 1 lot : </span>
									<span className="swap-amount">{Number( verifyVal(arrCurrency, 'swapShort')) + ` (${Number(swapamount[1])})`}</span>
								</div>
								
							</div>
							
							<div className="float-left">
								<div>
									<span>liquidation: &emsp;</span>	
									<span>High :&ensp;</span><span className="text-red">{high_liquid}</span>
								</div>
								<div>
									<span>liquidation: &emsp;</span>	
									<span>Low :&nbsp;&ensp;</span><span className="text-red">{low_liquid}</span>
								</div>
							</div>
							<div className="float-left">
								<div>
									<span>Trade Range High: &emsp;<span className="text-red">{openPriceRange[0]}</span></span>	
								</div>
								<div>
									<span>Trade Range Low: &emsp;<span className="text-red">{openPriceRange[1]}</span></span>	
								</div>
							</div>
						</div>
						
					</div>
				</div>	
			</div>
		</div>
	);
}

export default InvestmentComponent;
	