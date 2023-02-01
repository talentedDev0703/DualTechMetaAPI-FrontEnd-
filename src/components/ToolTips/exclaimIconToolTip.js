import React, { useState, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import { AiFillExclamationCircle } from "react-icons/ai";
import './animation.css';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export default function ColorPanelToolTip({handler}) {
  const [show, setShow] = useState(false);
  const [clickbtn, setClickBtn] = useState(false);
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

  return (
    <div ref={ref} >
      
    <AiFillExclamationCircle className="exclamStyle" onClick={handleClick} />
      
    <ClickAwayListener onClickAway={handleOutClick}>
      <Overlay
        show={show}
        target={target}
        placement="top"
        container={ref}
        containerPadding={20}
       >
        <Popover id="popover-contained">
          <Popover.Header></Popover.Header>
          <Popover.Body>
            <div className='exclaimToolTip-container'>
                  <div className="exclaimToolTip-panel">
                      <p>+=too much money</p>
                      <p>-=not enough money</p>
                  </div>
                  <div className='triangleTransfer'/>

            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
      
      </ClickAwayListener>
    </div>
  );
}
