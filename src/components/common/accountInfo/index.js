import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { MdCircle } from "react-icons/md";
import $ from "jquery";

import "./style.css";
import ExclaimIconToolTip from "../../ToolTips/exclaimIconToolTip";
import  UserListToolTip from "../../ToolTips/userListToolTip";
import {FcComboChart} from 'react-icons/fc';

function AccountInfo(props) {

    const location = useLocation();
    const history = useHistory();
    const userInfo = (props.userInfo)?props.userInfo:{
        id: 0,
        username: 'unknown',
        usertype: 0,
        skrill_wallet: 0,
        reward_stopout_level: 0,
        hedge_stopout_level: 0
    };
    let isShowUses = (props.isShowUses)?props.isShowUses:0;
    let userList = (props.userList)?props.userList:[];
    let agentInfo = (props.agentInfo)?props.agentInfo:{};
    // console.log('agentInfo---', agentInfo);
    // console.log('userInfo---', userInfo);
    let award = (props.reward)?props.reward:{};
    let hedge = (props.hedge)?props.hedge:{};
    let transfer = [0, 0];
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

    // sum property value of objects in Object array
	const sum = function(items, prop){
		return items.reduce( function(a, b){
			return a + b[prop];
		}, 0);
	};

    const processUserInfo = (rewardObj, hedgeObj) =>{
        if (rewardObj && rewardObj.orders) {
            rewardObj['sumlot'] = sum(rewardObj.orders, 'volume');
            rewardObj['freeMargin'] = rewardObj['freeMargin'] + rewardObj['margin'] * verifyVal(userInfo, 'reward_stopout_level');
            rewardObj['freepip'] = (rewardObj['sumlot'] != 0)?Number((rewardObj['freeMargin']/10)/rewardObj['sumlot']):0;
        }
        if (hedgeObj && hedgeObj.orders) {
            hedgeObj['sumlot'] = sum(hedgeObj.orders, 'volume');
            hedgeObj['freeMargin'] = hedgeObj['freeMargin'] + hedgeObj['margin'] * verifyVal(userInfo, 'hedge_stopout_level');
            hedgeObj['freepip'] = (hedgeObj['sumlot'] != 0)?Number((hedgeObj['freeMargin']/10)/hedgeObj['sumlot']):0;
        }

        if(rewardObj && hedgeObj){
            var diff_freemargin = (verifyVal(rewardObj, 'freeMargin')) - (verifyVal(hedgeObj, 'freeMargin'));
            transfer[0] = (-1*diff_freemargin/2).toFixed();
            transfer[1] = (diff_freemargin/2).toFixed();
        }
        
    }

    const verifyVal = (obj, key, datatype = 'N')=>{
		if(!obj || !obj[key]) return (datatype==='N'?0:' ');
		return obj[key];
	}

    const setTopScroll=(index)=>{
		$(".client_list" ).scrollTop(164*index);
	}

    processUserInfo(award, hedge);

    return (
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
                <p className={iscritical(transfer[0])}><span>{(Number(transfer[0])<0)?'':'+'}</span>{transfer[0]}</p>
				<p className={iscritical(transfer[1])}><span>{(Number(transfer[1])<0)?'':'+'}</span>{transfer[1]}</p>
            </div>
            <div className="border-right" />
            <div>
                <p>Skrill Wallet</p>
                <p>{verifyVal(userInfo, 'skrill_wallet') }</p>
            </div>
            <div className="border-right" />
            <div>
                <p>Total Wallets</p>
                <p>{(award)?((verifyVal(award, 'equity'))+(verifyVal(hedge, 'equity'))+(verifyVal(userInfo, 'skrill_wallet'))).toFixed().toLocaleString(lang,numberCurrency0):0}</p>
            </div>
            <div className="mr-asscrollbar" >
                <FcComboChart className="agent-minichart_icon" onClick={(event)=>{history.push("/client",{usertype: userInfo.usertype,userid: userInfo.id,username: userInfo.username, agentid:(agentInfo.id?agentInfo.id:userInfo.id) ,agentname: (agentInfo.name?agentInfo.name:userInfo.name)})}} />
                {(isShowUses)?(<UserListToolTip userList={userList} handler={setTopScroll} className="agent-userlist"/>):(<></>)}
            </div>  
        </div>
    );
}

export default AccountInfo;