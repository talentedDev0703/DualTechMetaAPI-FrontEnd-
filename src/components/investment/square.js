import React from 'react';


function BrownSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('brown', 0)}><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#404040"></rect>
            </svg></div>
  }
function BlueSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('blue', 1)} ><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#00b0f0"></rect>
            </svg></div>
  }  
function GreenSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('green', 2)}><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#10ff10"></rect>
            </svg></div>
  }  
function OrangeSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('orange', 3)}><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#ed7d31"></rect>
            </svg></div>
  }  
function GelbSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('gelb', 4)}><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#ffc000"></rect>
            </svg></div>
  } 
function PastelblueSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('pastelblue', 5)}><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#3e77aa"></rect>
            </svg></div>
  } 
function PastelgreenSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('pastelgreen', 6)}><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#629400"></rect>
            </svg></div>
  }  
function PastelorangeSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('pastelorange', 7)}><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#c46220"></rect>
            </svg></div>
  }              
function PastelgelbSquare(props) {
    return  <div className="colorpan" onClick={(event)=>props.handler('pastelgelb', 8)}><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#ffe699"></rect>
            </svg></div>
  }    
function EmptySquare(props) {
    return  <div className="colorpan empty"><svg version="1.1" baseProfile="full" 
                    width="18" height="18" 
                    xlmns="http://www/w3/org/2000/svg">
                <rect width="100%" height="100%" fill="#00000000"></rect>
            </svg></div>
  }  
export {BrownSquare, BlueSquare, GreenSquare, OrangeSquare, GelbSquare,EmptySquare, 
        PastelblueSquare, PastelgreenSquare, PastelorangeSquare, PastelgelbSquare}; 