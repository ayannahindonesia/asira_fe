import axios from 'axios'
import { serverUrl } from '../url';
import { getToken } from '../index/token';

export async function AddTipeBankFunction (param){
    return new Promise (async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };
        axios.post(serverUrl+`admin/bank_types`,param,config)
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function ListTipeBankFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
          };
          let filter = '';

          for(const key in param) {
              filter += `&${key}=${param[key]}`
          }
        axios.get(serverUrl+`admin/bank_types?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.listBankType = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
            
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function DetailTipeBankFunction(params,next) {
    return new Promise(async(resolve)=>{
        
            const config = {
                headers: {'Authorization': "Bearer " + getToken()}
              };
          
            axios.get(serverUrl+`admin/bank_types/${params.id}`,config)
            .then((res)=>{
                if(next){
                    resolve(next(params))
                }else{
                    resolve(res.data)
                }
            })
            .catch((err)=>{
                const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
                params.error = error;
                resolve(params);
            })
        
    })    
}

export async function EditTipeBankFunction(params) {
    return new Promise(async(resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };
        axios.patch(serverUrl+`admin/bank_types/${params.id}`,params.newData,config)
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            params.error = error;
            resolve(params);
        })
    })
}