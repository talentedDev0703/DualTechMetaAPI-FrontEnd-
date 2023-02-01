import React, { useState, useEffect }  from 'react';
import { memo } from "react";
import { AdvancedChart } from "react-tradingview-embed";
import CreatableSelect from 'react-select/creatable';
import {BsSearch} from "react-icons/bs"

import './style.css';

const createOption = (label) => ({
	label,
	value: label.toLowerCase().replace(/\W/g, ''),
});
let options;

const defaultOptions = [
	createOption('USDMXN'),
	createOption('USDEUR'),
	createOption('USDBTC'),
];

const Menuchart = (props) => {

	const index = props.index;
	const linecolors = [
		["rgba(41, 98, 215, 1)", "rgba(41, 98, 255, 0.52)", "rgba(0, 188, 252, 0)"],
		["rgba(58, 130, 178, 1)","rgba(58, 130, 168, 0.52)", "rgba(58, 130, 168, 0)"],
		["rgba(97, 178, 63, 1)","rgba(97, 178, 63, 0.52)", "rgba(97, 178, 63, 0)"],
		["rgba(199, 98, 36, 1)","rgba(199, 98, 36, 0.52)","rgba(199, 98, 36, 0)"],
		["rgba(216, 162, 35, 1)","rgba(216, 162, 35, 0.52)","rgba(216, 162, 35, 0)"],
		["rgba(58, 177, 172, 1)","rgba(58, 157, 172, 0.52)", "rgba(58, 157, 172, 0)"],
		["rgba(147, 168, 103, 1)","rgba(147, 168, 103, 0.52)","rgba(147, 168, 103, 0)"],
		["rgba(170, 90, 69, 1)","rgba(170, 90, 69, 0.52)","rgba(170, 90, 69, 0)"],
		["rgba(215, 176, 114, 1)","rgba(215, 176, 114, 0.52)","rgba(215, 176, 114, 0)"]
	]; 

	const [isLoading, setIsLoading] = useState(false);
	const [optionList, setOptionList] = useState(defaultOptions);
	const [value, setValue] = useState({label:"USDMXN", value: "USDMXN"});

	const handleChange = (value) => {
		if(value!==null)
			props.setCurrencyName(value.value);
		setValue(value);
	}

	const handleCreate = (inputValue) => {
		setIsLoading(true);
		setTimeout(() => {
		  const newOption = createOption(inputValue);
		  setIsLoading(false);
		  setOptionList((prev) => [...prev, newOption]);
		  setValue(newOption);
		}, 1000);
	};

	options =   {
		"symbols": [
			[
				value.value + "|1D"
			]
		],
		"width": "100%",
		"height": "100%",
		"symbol": "OANDA:USDMXN",
		"interval": "D",
		"timezone": "Etc/UTC",
		"theme": "dark",
		"style": "3",
		"locale": "en",
		"toolbar_bg": "#f1f3f6",
		"enable_publishing": false,
		"allow_symbol_change": true,
		"container_id": "tradingview_e54bc",
		"gridLineColor": "rgba(0, 0, 0, 0.06)",
		"backgroundColor": "rgba(23, 24, 26, 1)",
		"lineWidth": 1,
		"lineColor": linecolors[index][0],
		"topColor": linecolors[index][1],
		"bottomColor": linecolors[index][2],	
	}

	useEffect(() => {
		options =   {
			"symbols": [
				[
					value.value + "|1D"
				]
			],
			"width": "100%",
			"height": "100%",
			"symbol": "OANDA:USDMXN",
			"interval": "D",
			"timezone": "Etc/UTC",
			"theme": "dark",
			"style": "3",
			"locale": "en",
			"toolbar_bg": "#f1f3f6",
			"enable_publishing": false,
			"allow_symbol_change": true,
			"container_id": "tradingview_e54bc",
			"gridLineColor": "rgba(0, 0, 0, 0.06)",
			"backgroundColor": "rgba(23, 24, 26, 1)",
			"lineWidth": 1,
			"lineColor": linecolors[index][0],
			"topColor": linecolors[index][1],
			"bottomColor": linecolors[index][2],	
		}
		return () => {
			
		};
	}, [value]);

	return (
			<div className='mychart-container' > 
				{/* <div className='currency_div'>
					<CreatableSelect
						isClearable
						isDisabled={isLoading}
						isLoading={isLoading}
						onChange={handleChange}
						onCreateOption={handleCreate}
						options={optionList}
						value={value}
					/>
				</div> */}
				<AdvancedChart widgetProps={options} />
			</div>
	)
};

export default memo(Menuchart);