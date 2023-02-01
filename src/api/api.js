import axios from "axios";
import ioClient from 'socket.io-client';

const api_url = "";//"http://localhost:3001";
const axiosJWT = axios.create();

const getSocket = ioClient(`${api_url}/`);

const getMetaAccounts = async (userid) => {
    return  axiosJWT.post(`${api_url}/metaaccounts`, {
                headers: {
                // Authorization: `Bearer ${token}`
                },
                params: {id:userid}
            });	
}
// get client's investment amount.
const getInvestment = (userid) => {
    return  axiosJWT.post(`${api_url}/getInvestment`, {
                id:userid
            });	
}

//get get Currency information (swap value)
const getCurrencyInfo = (accountid, currency) => {
    console.log('accountid', accountid)
    return axios.get(`${api_url}/getCurrencyInfo`, {params:{ac_id: accountid, currency: currency}}); 
}

// set client's funded wallet amount.
const setSkrillwallet = (userid, value) => {
    return  axiosJWT.put(`${api_url}/setSkrillwallet`, {
        id:userid,
        val: value
    });	
}

// get client's funded wallet amount.
const getSkrillwallet = (userid) => {
    return  axiosJWT.post(`${api_url}/getSkrillwallet`, {
        id:userid
    });	
}

//logout
const logout = async (history) => {
    try {
      await axios.delete(`${api_url}/logout`);
      sessionStorage.removeItem('cid');
      sessionStorage.removeItem('cname');
      sessionStorage.removeItem('ctype');
      history.push("/");
    } catch (error) {
        console.log(error);
    }
}

// get all client of agent
const getClients = async (userid, usertype) => {
    try {
        const response = await  axiosJWT.get(`${api_url}/getClients`, {
            headers: {
                // Authorization: `Bearer ${token}`
            },
            params: {id:userid,usertype:usertype}
        });
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}
const getMeta = async (userid,usertype) => {
    try {
    const response = await  axiosJWT.post(`${api_url}/getMeta`, {
        headers: {
            // Authorization: `Bearer ${token}`
        },
            params: {id:userid,usertype:usertype}
    });
    console.log('data:',response.data);
    return response.data;
    }
    catch (error) {
    console.log(error);
    }
}

export { getMetaAccounts, getInvestment, setSkrillwallet, getSkrillwallet, logout, getClients, getMeta, getCurrencyInfo, api_url, getSocket };