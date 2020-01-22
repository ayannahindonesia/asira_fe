import axios from 'axios'
import { serverUrl } from '../url';
import { getToken } from '../index/token';

export async function AddRoleFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };
        axios.post(serverUrl+'admin/roles',param,config)
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

export async function ListRoleFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " + getToken()}
        };
        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }
        axios.get(serverUrl+`admin/roles?orderby=updated_at&sort=desc${filter}`,config)
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

export async function DetailRoleFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " +  getToken()}
        };
        axios.get(serverUrl+`admin/roles/${param.id}`,config)
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

export async function EditRoleFunction (param){
    return new Promise(async (resolve)=>{
        const config = {
            headers: {'Authorization': "Bearer " +  getToken()}
        };
        axios.patch(serverUrl+`admin/roles/${param.id}`,param.newData,config)
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