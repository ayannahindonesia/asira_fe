import axios from 'axios'
import {serverUrl} from '../url'
import { getTokenClient } from '../index/token'
import { destructErrorMessage } from '../global/globalFunction';

export async function listProductFunction (param,next){
    return new Promise (async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };
        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        axios.get(serverUrl+`lender/products?orderby=updated_at&sort=desc${filter}`,config)
        .then((res)=>{
            param.productList = res.data
            if(next){
                resolve(next(param))
            }else{
                resolve(param)
            }
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()

            param.error = error;
            resolve(param);
        })
    })
}

export async function detailProductFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };
        axios.get(serverUrl+`lender/products/${param.id}`,config)
        .then((res)=>{
            param.dataProduct = res.data
            if(next){
                resolve(next(param))
            }
            resolve(res.data)
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()

            param.error = error;
            resolve(param);
        })
    })
}

export async function detailServiceProductFunction(param,next) {
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };
        axios.get(serverUrl+`lender/services/${param.dataProduct.service_id}`,config)
        .then((res)=>{
            const data = res.data && res.data.data ? res.data.data : res.data;
            param.serviceProduct = data;
            if(next){
                resolve(next(param))
            }
            resolve(param)
        })
        .catch((err)=>{
            const error = (err.response && err.response.data && destructErrorMessage(err.response.data))|| err.toString()

            param.error = error;
            resolve(param);
        })
    })
}