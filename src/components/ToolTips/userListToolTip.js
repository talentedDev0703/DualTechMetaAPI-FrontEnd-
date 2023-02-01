import React, { useState, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import { BsChevronCompactDown } from "react-icons/bs";
import './animation.css';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export default function UserListToolTip(props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const userList =props.userList; 
  const handleClick = (e) => {
  setClickBtn(true);
  setShow(!show);
  setTarget(e.target);
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

  return (
    <div ref={ref} style={{width: '25px'}}>
      <BsChevronCompactDown className="user-list" onClick={handleClick}/>
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
            <div className='user-container'>
                <div className='triangle1'/>
                <div className='userListPanel'>
                  {
                    userList.map ( (item, i)=> {
                        return (<p key={i} onClick={(event)=>{props.handler(i)}} >{userList[i].username}</p>);
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
