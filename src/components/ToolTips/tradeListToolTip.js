import React, { useState, useRef } from "react";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import { BsChevronCompactDown } from "react-icons/bs";
import "./animation.css";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export default function TradeListToolTip(props) {
	const [show, setShow] = useState(false);
	const [target, setTarget] = useState(null);
	const ref = useRef(null);
	const handleClick = (event) => {
		setClickBtn(true);
		setShow(!show);
		setTarget(event.target);
	};
	
	const handleOutClick = () => {
		if(clickbtn)
		{
		  	setClickBtn(false);
		  	return;
		}
		setShow(false);
	}
	const [clickbtn, setClickBtn] = useState(false);

	const {rewards, hedges} = props.orders;
	let len1 = (rewards).length;
	let len2 = (hedges).length;
	let len = (len1>len2)?len1:len2;
	
	let list = []

	for (let i=0; i<len; i++) {
		let {positionid1, positionid2} = '';
		if(rewards[i]){
			positionid1 = rewards[i].id;
			list.push(
				<tr key={i*2} style={{height: '30px'}}>
					<td>{rewards[i].id}</td>
					<td>{rewards[i].symbol}</td>
					<td>{rewards[i].type==='POSITION_TYPE_SELL'?(<span className="text-green">Sell</span>):(<span className="text-red">Buy</span>)}</td>
					<td>{rewards[i].time}</td>
					<td>{(rewards[i].volume).toFixed(2)}</td>
					<td>{(rewards[i].openPrice).toFixed(5)}</td>
					<td>{(rewards[i].currentPrice).toFixed(5)}</td>
					<td>{rewards[i].swap}</td>
					<td>{(rewards[i].profit).toFixed(2)}</td>
					
				</tr>
			)
		}else{
			list.push(
				<tr key={i*2} style={{height: '30px'}}>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					
				</tr>
			)
		}
		if(hedges[i]){
			positionid2 = hedges[i].id;
			list.push(
				<tr key={i*2+1} style={{height: '30px'}}>
					<td>{hedges[i].id}</td>
					<td>{hedges[i].symbol}</td>
					<td>{hedges[i].type==='POSITION_TYPE_SELL'?(<span className="text-green">Sell</span>):(<span className="text-red">Buy</span>)}</td>
					<td>{hedges[i].time}</td>
					<td>{(hedges[i].volume).toFixed(2)}</td>
					<td>{(hedges[i].openPrice).toFixed(5)}</td>
					<td>{(hedges[i].currentPrice).toFixed(5)}</td>
					<td>{hedges[i].swap}</td>
					<td>{(hedges[i].profit).toFixed(2)}</td>
					<td style={{position:'relative'}} onClick={()=>props.closeTrading(positionid1, positionid2)}><span className="closeTradeBtn">X</span></td>
				</tr>
			)
		}else{
			list.push(
				<tr key={i*2+1} style={{height: '30px'}}>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td style={{position:'relative'}} onClick={()=>props.closeTrading(positionid1, positionid2)}><span className="closeTradeBtn">X</span></td>
				</tr>
			)
		}
	}

	return (
		<div   ref={ref}>
			<BsChevronCompactDown className="trade-list" onClick={handleClick} />
			<ClickAwayListener onClickAway={handleOutClick}>
			<Overlay
				show={show}
				target={target}
				placement="left"
				container={ref}
				containerPadding={20}
			>
				<Popover id="popover-contained">
					<Popover.Header></Popover.Header>
					<Popover.Body> 
						<div className="trade-container">
							<div className="trade-inf">
								<table>
									<thead>
										<tr className="orders_theader">
											<th>Order</th>
											<th>Symbol</th>
											<th>Type</th>
											<th>Open Time</th>
											<th>Size</th>
											<th>OpenPrice</th>
											<th>Price</th>
											<th>Swap</th>
											<th>Profit</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody id="position_history">
										{	list
											// props.orders.map((item, index)=> {
												// return (
												// 	<tr key={index} style={{height: '30px'  }}>
												// 		<td>{item.id}</td>
												// 		<td>{item.symbol}</td>
												// 		<td>{item.type==='POSITION_TYPE_SELL'?(<span className="text-green">Sell</span>):(<span className="text-red">Buy</span>)}</td>
												// 		<td>{item.time}</td>
												// 		<td>{item.volume}</td>
												// 		<td>{(item.openPrice).toFixed(5)}</td>
												// 		<td>{(item.currentPrice).toFixed(5)}</td>
												// 		<td>{item.swap}</td>
												// 		<td>{item.profit}</td>
												// 		<td>Action</td>
												// 	</tr>
												// );
											// })
										}
									</tbody>
								</table>
							</div>
							<div className="triangle3" />
						</div>
					</Popover.Body>
				</Popover>
			</Overlay>
			</ClickAwayListener>

		</div>
	);
}
