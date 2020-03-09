import axios from 'axios'
import {serverUrl} from '../url'
import { getTokenClient } from '../index/token'

export async function getAllLayananListFunction (param,next){
    return new Promise(async (resolve)=>{
        let filter = '';
        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }
        
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };

        axios.get(serverUrl+`lender/services?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.layananList = res.data;
            resolve(param)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function getAllLayananDetailFunction (param,next){
    return new Promise(async (resolve)=>{  
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };
        axios.get(serverUrl+`lender/services/${param.id}`,config)
        .then((res)=>{
            param.layananListDetail = res.data;
            resolve(param)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}
