import axios from 'axios'
import {serverUrl} from '../url'
import { getTokenClient } from '../index/token'

export async function getPermintaanPinjamanFunction (param , next){
    return new Promise (async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };
       
        let filter =''

        for (const key in param){
            filter += `&${key}=${param[key]}`
        }
        
        axios.get(serverUrl+`lender/loanrequest_list?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.loanRequest = res.data
            param.config = res.config.url

            if(next){
                resolve(next(param))
            } else {
                resolve(param)
            }   
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function getPermintaanPinjamanDetailFunction (param, status, next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };

        let newLink = serverUrl+`lender/loanrequest_list/${param.idLoan}/detail`;

        if(status && status.toString().trim().length !== 0) {
            if(status === 'tolak') {
            newLink += `/reject?reason=${param.reason}`
            } else {
            newLink += `/approve?disburse_date=${param.dateApprove}`
            }
        }
          
        axios.get(newLink,config).then((res)=>{
            param.dataLender = res.data;
            param.idBorrower = (res.data.owner && res.data.owner.Int64) || 0;
            if(next){
                resolve(next(param))
            }
            resolve(param)
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
    
}

export async function CSVDownloadFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };
        
        let urlNew = serverUrl+`lender/loanrequest_list/download?orderby=updated_at&sort=desc`;

        for(const key in param) {
            urlNew += `&${key}=${param[key]}`
        }
        
        axios.get(urlNew,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function confirmDisburseFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
        headers: {'Authorization': "Bearer " + getTokenClient()}
        };

        axios.get(serverUrl+`lender/loanrequest_list/${param.id}/detail/confirm_disbursement`,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function changeDisburseDateFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };

        axios.get(serverUrl+`lender/loanrequest_list/${param.id}/detail/change_disburse_date?disburse_date=${param.date}`,config)
        .then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

