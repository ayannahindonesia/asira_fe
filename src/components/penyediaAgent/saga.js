import axios from 'axios'
import {serverUrl} from '../url'
import { getToken } from '../index/token'

export async function addPenyediaAgentFunction (param,next){
    return new Promise (async(resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };
        
        axios.post(serverUrl+'admin/agent_providers',param,config)
        .then((res)=>{
            param.result = res
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function getPenyediaAgentListFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
            
        };

        let filter =''

        for (const key in param){
            filter += `&${key}=${param[key]}`
        }
        axios.get(serverUrl+`admin/agent_providers?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.dataListAgent = res.data
            
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    })
    
}

export async function getPenyediaAgentDetailFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
            
        };

        axios.get(serverUrl+`admin/agent_providers/${param.id}`,config)
        .then((res)=>{
            param.dataAgentDetail = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    })
    
}

export async function editPenyediaAgentFunction (param,next){
    return new Promise (async(resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };
        axios.patch(serverUrl+`admin/agent_providers/${param.id}`,param.newData,config)
        .then((res)=>{
            param.result = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    })
}