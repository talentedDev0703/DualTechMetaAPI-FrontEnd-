import React,{useState,useEffect} from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';
import ViewCount from './pagination/viewCount';
import Pagination from './pagination/pagenation';
import {  MdEdit, MdSave  } from "react-icons/md"
import {  BsChevronLeft, BsChevronRight, BsTrash } from 'react-icons/bs'
import Swal from 'sweetalert2'
import $ from 'jquery';

import { api_url } from '../../api/api';
let arr_header = [
  "Client No   ",  
  "PreName     ",  
  "LastName    ",  
  "E-mail/Login",  
  "Password    ",  
  "Phone No    ",  
  "Investment  ",  
  "ExternWallet",
  "RewardBroker", 
  "Server      ",
  "StopOutLevel%",
  "MetaAPI-ID  ",
  "MT4 Account ",
  "MT4 TraderPW",
  "MT4 OnlyRead",
  "HedgingBroker",
  "Server      ",
  "StopOutLevel%",
  "MetaAPI-ID  ",
  "MT4 Account ",
  "MT4 TraderPW",
  "MT4 OnlyRead",
];

const UserDetailList = () => {

  const [name, setName] = useState('');
  const [test, setTest] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [data, setData] = useState([]);
  const [msg,setMsg] = useState([]);
  const history = useHistory();
  const [disable,setdisable] = useState(true);
  // const [editState, setEditState] = useState("uneditable")
  const [scrolloff,setScrolloff] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [curPageSize,setCurPageSize] = useState(5);
  const [totalSize, setTotalSize] = useState(0);
  const [pastData,setPastData] = useState([]);

  const handleScroll=()=>{
    setScrolloff($(".table-container" ).scrollLeft());
  }
  const setLeftScroll = (pos) =>{
    $(".table-container" ).scrollLeft(pos);
    setScrolloff($(".table-container" ).scrollLeft());
    }

  const userEdit = () => {
    setDisable(false);
    if(button === "edit"){
      setButton("save");
      setInputStyle("inputStyle");
    }else{
      setButton("edit");
      setDisable(true);
      setInputStyle("");
    }
  }
 
  const onCountHandle = (pagesize) => {
    setCurrentPage(1);
    setCurPageSize(pagesize);
  }
  const [isdisabled, setDisable] = useState(true);
  const [button, setButton] = useState('edit');
  const [inputStyle, setInputStyle] = useState('');
  const [selectId, setSelectId] = useState("");

  useEffect(() => {
    RetrieverDataProcess().then((result)=>{
      setData(result.rows);
      setPastData(result.rows);
      setTotalSize(result.count);
    });
    // console.log('data2 is ', data);
  }, [currentPage, curPageSize])
     
  useEffect(() => {
    setCurrentPage(currentPage);
    setCurPageSize(curPageSize);
    //refreshToken();
    console.log(data);
  }, [data]);

  const axiosJWT = axios.create();

  const RetrieverDataProcess = async () => {
    let userdata = await getUsers();
    return userdata;
}
  const getUsers = async () => {
    try {
      const response = await  axiosJWT.get(`${api_url}/users`, {
          headers: {
              //Authorization: `Bearer ${token}`
          },
          params: {page: currentPage, limit: curPageSize}
      });
      console.log('response is : ', response.data.rows);
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  const refreshToken = async () => {
    try {
        const response = await axiosJWT.get(`${api_url}/token`);
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

  //axiosJWT.interceptors.request.use(async (config) => {
      //const currentDate = new Date();
      //if (expire * 1000 < currentDate.getTime()) {
      //    const response = await axios.get('/token');
       //   config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        //  setToken(response.data.accessToken);
          //const decoded = jwt_decode(response.data.accessToken);
         // setName(decoded.name);
          //setExpire(decoded.exp);
      //}
     // return config;
 // }, (error) => {
    //  return Promise.reject(error);
 // });

  
  const update = async (id,data) => {
    try {
        const response = await axios.post(`${api_url}/Update`, {
          id: id,
          data: data
        });
        // const decode = jwt_decode(response.data);
        sweatAlert('success', "save success");
        setdisable(true);
        setSelectId('');
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }
  }

  const sweatAlert = (type, text) =>{
		Swal.fire({
			title: 'Report',
			text: text,
			icon: type,
			confirmButtonText: 'OK'
		})
	}

  const deleteUser = async(user_id) => {
    try {
      const response = await axios.delete(`${api_url}/deleteUser`, {
        data: {
          id: user_id
        }
      });
      // const decode = jwt_decode(response.data);
      sweatAlert('success', "delete success");
      setdisable(true);
      setSelectId('');
      RetrieverDataProcess().then((result)=>{
        setData(result.rows);
        setPastData(result.rows);
        setTotalSize(result.count);
      });
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }
  }
  
  return(
    <div>
      <div>
          {(scrolloff < 10)?"":<BsChevronLeft className="icon-previous" onClick={()=>{setLeftScroll(0);setScrolloff(0)}}/>}
          {(scrolloff > 1400)?"":<BsChevronRight className="icon-next" onClick={()=>{setLeftScroll(1450);setScrolloff(1450)}}/>}
      </div>
      <div className="header-table">
          <p className="title-data-container">Broker Datas</p>
          {(disable === true)?
                <MdEdit className="saveButton button_disable"
                      onClick={()=>{
                                  setdisable(false);
                                  console.log("past",pastData);
                            }}
                />:(selectId !=="")?
                <MdEdit className="saveButton"
                          onClick={()=>{
                            console.log(pastData);
                                setData(pastData);
                                setdisable(true);
                          }} />:
                <MdEdit className="saveButton"
                            onClick={()=>{
                                setdisable(true);
                            }} />}
          {(selectId !== "" && disable === false)? 
              <MdSave className="saveButton1 "
                      onClick={()=>{
                              const id = selectId;
                              console.log(data[id].id);
                              update(data[id].id,data[selectId]);
                              setInputStyle("");
                } 
                }/>: <MdSave className="saveButton1 button_disable"/>
            }
      </div>
      <div  className="table-container" onScroll={handleScroll}>
      {/* <table>
        <thead>
          <tr className="headfix">
            <th>No</th>
            <th>Pre Name</th>
            <th>Last Name</th>
            <th>Client No</th>
            <th>Password</th>
            <th>Investment</th>
            <th>Skrill Wallet</th>
            <th className="tabletext-green">Swap Broker</th>
            <th className="tabletext-green">Server</th>
            <th className="tabletext-green">MetaAPI Id(reward)</th>
            <th className="tabletext-green">MT4 Account No</th>
            <th className="tabletext-green">PW: Only Read</th>
            <th className="tabletext-green">PW: Trader</th>
            <th className="tabletext-green">StopOut level%</th>
            <th className="tabletext-blue">Swap Free Broker</th>
            <th className="tabletext-blue">Server</th>
            <th className="tabletext-blue">MetaAPI Id(hedge)</th>
            <th className="tabletext-blue">MT4 Account No</th>
            <th className="tabletext-blue">PW: Only Read</th>
            <th className="tabletext-blue">PW: Trader</th>
            <th className="tabletext-blue">StopOut level%</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
        {
          data.map(
          (item,key)=>{  
            let keys = Object.keys(item);
            keys = keys.slice(1, keys.length) ; 
            return(
            <tr id = {"user"+key} 
              key={key}
              onClick={()=>{  
                setSelectId(key);
                setDisable(false);
                if(disable === false){
                  // setButton("save");
                  setInputStyle("inputStyle");
                }else{
                  setSelectId('');
                }
              }}>
              <td nowrap="nowrap">{key+(currentPage-1)*curPageSize+1}</td>
              {
                keys.map(
                  (field,index)=>{
                    return(                     
                      <td nowrap="nowrap" key={index}>
                        {(selectId === key && disable === false)?
                          <input value ={item[field]} 
                            onChange={
                                (event) => {
                                  let newArr = [...data]; 
                                  newArr[key][field] = event.target.value;     
                                  setData(newArr);
                                  RetrieverDataProcess().then((result)=>{
                                    setPastData(result.rows);
                                  });
                                  console.log(key);
                                }
                            } disabled = {isdisabled} className = {inputStyle}
                          />:
                          <input value ={item[field]}  disabledclassname = "" onChange={()=>{}}/>
                            }                                   
                      </td>
                  )
                    
                  }
                )
              }
              <td align="center"><BsTrash  onClick={()=>deleteUser(item.id)} />
              </td>
            </tr>
          )}
          )}

          
        </tbody>
      </table> */}
        {
            data.map((item,key)=>{
              let keys = Object.keys(item);
              keys = keys.slice(1, keys.length) ; 
              
              return (
                <table className="account-table" key={key}>
                  <tbody>
                  {
                    keys.map(
                      (field,index)=>{
                        return( 
                          <tr key={index} onClick={()=>{  
                            setSelectId(key);
                            setDisable(false);
                            if(disable === false){
                              // setButton("save");
                              setInputStyle("inputStyle");
                            }else{
                              setSelectId('');
                            }
                          }}>
                            <td style={{paddingTop: '9px'}} className={index>7?(index>14?"tabletext-blue ":"tabletext-green "): ""}>{arr_header[index]}</td>                    
                            <td className="account-input" nowrap="wrap" key={index}>
                              {(selectId === key && disable === false)?
                                <input   className={(index>7?(index>14?"tabletext-blue ":"tabletext-green "): " ") + inputStyle} value ={(item[field]!=undefined)?item[field]:''} 
                                  onChange={
                                      (event) => {
                                        let newArr = [...data]; 
                                        newArr[key][field] = event.target.value;     
                                        setData(newArr);
                                        RetrieverDataProcess().then((result)=>{
                                          setPastData(result.rows);
                                        });
                                        console.log(key);
                                      }
                                  } disabled = {isdisabled} 
                                />:
                                <input value ={item[field]}   disabled className={(index>7?(index>14?"tabletext-blue ":"tabletext-green "): " ")} onChange={()=>{}}/>
                                  }                                   
                            </td>
                          </tr>
                      )
                        
                      }
                    )
                  }
                  </tbody>
                </table>
              );
            })
        }
      </div>
      <div className="pt-2">
        <ViewCount
          totalCount={data.length}
          onSizeChange={(pagesize) => onCountHandle(pagesize)}      
          />
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={totalSize}
          pageSize={curPageSize}
          onPageChange={page => {setCurrentPage(page);setSelectId(""); setButton("edit");}}
        />
      </div>
      
    </div>
  )
}
export default UserDetailList;