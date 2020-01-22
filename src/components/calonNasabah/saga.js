import axios from 'axios';
import { serverUrl } from '../url';
import { getTokenClient } from '../index/token';

export async function getAllBorrowerFunction(param, next){
    return new Promise(async (resolve) => {

        const token = getTokenClient();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }
      
        const urlNew = serverUrl+`lender/borrower_list?account_number=null&orderby=updated_at&sort=desc${filter}`
        
        axios.get(urlNew,config).then((res)=>{
            const listUser = res.data && res.data.data
            param.dataUser = listUser;
            param.totalData = res.data.total_data

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    });
};

export async function getBorrowerFunction(param, next) {
    return new Promise(async (resolve) => {

        const token = getTokenClient();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        const urlNew = serverUrl+`lender/borrower_list/${param.calonNasabahId}/detail`
    
        axios.get(urlNew,config).then((res)=>{
            const listUser = res.data && res.data.data ? res.data.data : res.data;
            param.dataUser = listUser;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    });

}

export async function approveRejectFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };

        let accountNumberStringUrl = ''

        if(param.statusApproval && param.statusApproval === 'approve') {
            accountNumberStringUrl = `?account_number=${param.account_number}`
        }

        axios.get(serverUrl+`lender/borrower_list/${param.id}/${param.statusApproval}${accountNumberStringUrl}`,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

