import axios from 'axios'
import {serverUrl} from '../url'
import { getTokenClient } from '../index/token'

export async function getAllProfileNasabahFunction (param,next){
    return new Promise(async (resolve)=>{
        let filter = '';
        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }
        
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };

        axios.get(serverUrl+`lender/borrower_list?account_number=not null&orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.borrowerList = res.data;
            param.config = res.config.url
            resolve(param)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function getProfileNasabahDetailFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
          };
          axios.get(serverUrl+`lender/borrower_list/${param.id}/detail`,config)
          .then((res)=>{
              param.detailProfileNasabah = res.data
              param.configUrl = res.data.config.url
              if(next){
                  resolve(next(param))
              }else{
                  resolve(param)
              }
          })
          .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}

export async function deleteProfileNasabahFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
          };
          axios.get(serverUrl+`lender/borrower_list/delete_request/${param.id}/${param.status}`,config)
          .then((res)=>{
              param.detailProfileNasabah = res;
              if(next){
                  resolve(next(param))
              }else{
                  resolve(param)
              }
          })
          .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
}