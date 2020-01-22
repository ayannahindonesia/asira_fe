import {serverUrl, serverUrlGeo} from '../url'
import axios from 'axios'
import { getToken, getTokenGeo } from '../index/token';

export async function addBankFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
          };
        axios.post(serverUrl+'admin/banks',param,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }
            resolve(res)
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function getProvinsiFunction(param) {
    return new Promise(async (resolve)=>{
        const configGeo = {
            headers: {'Authorization': "Bearer " + getTokenGeo()}
            };
        axios.get(serverUrlGeo+`client/provinsi`,configGeo)
        .then((res)=>{
            resolve(res.data.data)
            
            })
        
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function getKabupatenFunction (param){
    return new Promise(async (resolve)=>{
        const configGeo = {
            headers: {'Authorization': "Bearer " + getTokenGeo()}
            };
        axios.get(serverUrlGeo+`client/provinsi/${param}/kota`,configGeo)
            .then((res)=>{
                resolve(res.data.data)
            })
            .catch((err)=>{
                const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
                param.error = error;
                resolve(param);
            })
    })
}

export async function getAllBankList (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        axios.get(serverUrl+`admin/banks?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.bankList = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function getBankDetailFunction (param,next){
    return new Promise(async (resolve)=>{
            const config = {
                headers: {'Authorization': "Bearer " + getToken()}
              };
          
            axios.get(serverUrl+`admin/banks/${param.id}`,config)
            .then((res)=>{
                param.dataBankDetail = res.data
                if(next){
                    resolve(next(param))
                }else{
                    resolve(res.data)
                }
            })
            .catch((err)=>{
                const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
                param.error = error;
                resolve(param);
            })
        
    })
}

export async function getBankTypesFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
        headers: {'Authorization': "Bearer " + getToken()}
        };
        axios.get(serverUrl+`admin/bank_types/${param.type}`,config)
        .then((res)=>{
           if(next){
               resolve(next(param))
           }else{
               resolve(res)
           }
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function editBankFunction (param,next){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };

        axios.patch(serverUrl+`admin/banks/${param.id}`,param.newData,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }
            resolve(res)
        })
        .catch((err)=>{
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}