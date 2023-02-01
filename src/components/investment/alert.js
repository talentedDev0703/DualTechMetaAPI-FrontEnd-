import React, {useEffect,useState} from 'react';
import { AiOutlineWarning } from "react-icons/ai";
import sound from "../../assets/siren/warning.mp3"
import {MdCircle} from "react-icons/md";

let alertaudio = new Audio (sound);

export default function Alertbox(props) {
	// console.log('alert props==',props);
    const stopOutFlag = (props.stopOutFlag)?props.stopOutFlag: 0;
    const [isSpreadAlertOn, setSpredAlertOn] = useState(1);
	const [isMarginAlertOn, setMarginAlertOn] = useState(0);
	const [isPriceAlertOn, setPriceAlertOn] = useState(1);
	// const [isStart, setStartFlag] = useState(1);
    const [alertpip, setPipalert] = useState(200);
	const [alertspread, setAlertSpread] = useState(350);
	const setAlertpip = (event) => {
		if((event.target.value<1000) && (event.target.value>=0))
			setPipalert(event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, 0));
	}

	const setAlertspreadValue = (event) => {
		if((event.target.value<10000) && (event.target.value>=0))
			setAlertSpread(event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, 0));
	}

    const setSpreadAlert=()=>{ isSpreadAlertOn?setSpredAlertOn(0):setSpredAlertOn(1) };
	const setMarginAlert=()=>{ 
		isMarginAlertOn?setMarginAlertOn(0):setMarginAlertOn(1) ;
		props.handleStopoutFlag(isMarginAlertOn?0:1);
	};
	const setPriceAlert=()=>{ isPriceAlertOn?setPriceAlertOn(0):setPriceAlertOn(1) };

    const compareValue = (array, standard) =>{
		let flag = 0;
		array.forEach(element => {
			// console.log(element, standard)
			if(Number(element).toFixed() < Number(standard))
				flag = 1;
		});
		if(flag)
			return 1
		else
			return 0;
	}

	let flag1 = (Number(props.spread)<Number(alertspread)) && isSpreadAlertOn;
	let flag2 = stopOutFlag && isMarginAlertOn;
	let flag3 = (compareValue(props.pip, alertpip)) && isPriceAlertOn;
	let isStart = (flag1 | flag2 | flag3);
	// console.log('flags', flag1, flag2, flag3);
	useEffect(()=>{
		if(!isStart){
			alertaudio.loop = false;
			alertaudio.pause();
		}else{
			alertaudio.pause();
			alertaudio.loop = true;
			alertaudio.play();
		}
		return ()=>{
			alertaudio.loop = false;
			alertaudio.pause();
		};
	}, [isStart]);

  return (
    <div>
        <ul className="alert-icons">
			<li>
				{isSpreadAlertOn? <MdCircle className="icon-green icon-state"  onClick={setSpreadAlert}/>: <MdCircle className="icon-red icon-state"  onClick={setSpreadAlert}/>}
				&nbsp; Alert if spread &nbsp; &lt;
					<input className="input-alert"  value={alertspread} placeholder="0.00" onChange={setAlertspreadValue} />
			</li>
			<li>
				{isMarginAlertOn? <MdCircle className="icon-green icon-state"  onClick={setMarginAlert}/>: <MdCircle className="icon-red icon-state"  onClick={setMarginAlert}/>}	
				&nbsp; StopOut &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; on/off
			</li>
			<li>
				{isPriceAlertOn? <MdCircle className="icon-green icon-state"  onClick={setPriceAlert}/>: <MdCircle className="icon-red icon-state"  onClick={setPriceAlert}/>}	
				&nbsp; Pip alert if pip &nbsp; &lt;
					<input className="input-alert"  value={alertpip} placeholder="0.00" onChange={setAlertpip} />
			</li>
		</ul>
        <div className='alertbox'>
            {((Number(props.spread)<alertspread) && isSpreadAlertOn)?<div className='spreadbar alertbar' ><AiOutlineWarning className='spreadicon warning-icon'/>Spread is lower than {alertspread}</div>:<div></div>}
            {(stopOutFlag && isMarginAlertOn)?<div className='marginbar alertbar' ><AiOutlineWarning className='marginicon warning-icon'/>Stopout on</div>:<div></div>}
            {(compareValue(props.pip, alertpip)) && isPriceAlertOn?<div className='pipbar alertbar' ><AiOutlineWarning className='pipicon warning-icon'/>Pip is lower than {alertpip}</div>:<div></div>}
        </div>
    </div>
  );
}
