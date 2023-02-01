import React, { useState, useRef,useEffect } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import { FiSettings } from "react-icons/fi";
import './animation.css';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export default function SymbolListToolTip(props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const symbolList = props.symbollist;
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
  useEffect(
    ()=>{

    }
  );

  return (
    <div ref={ref} className="d-inflex">
      <FiSettings className="symbolsetting" onClick={handleClick}/>
			<ClickAwayListener onClickAway={handleOutClick}>
      <Overlay
        show={show}
        target={target}
        placement="right"
        container={ref}
        containerPadding={20}
      >
        <Popover id="popover-contained">
          <Popover.Header></Popover.Header>
          <Popover.Body>
            <div className='symbol-container'>
                <div className='triangle2'/>
                <div className='symbolListPanel'>
                {
                    symbolList.map ( (item, i)=> {
                        return (<p onClick={(event)=>{props.handler(symbolList[i])}} >{symbolList[i]}</p>);
                    })
                  }
                </div>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
			</ClickAwayListener>
    </div>
  );
}
