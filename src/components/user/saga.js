import axios from 'axios';
import { serverUrl } from '../url';
import { getToken } from '../index/token';

export async function getAllUserFunction(param, next){
    return new Promise(async (resolve) => {

        const token = getToken();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        const urlNew = serverUrl+`admin/users?orderby=updated_at&sort=desc${filter}`
    
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

export async function getUserFunction(param, next) {
    return new Promise(async (resolve) => {

        const token = getToken();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        const urlNew = serverUrl+`admin/users/${param.userId}`
    
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

export async function patchUserAddFunction(param) {
    return new Promise(async (resolve) => {   
        const token = getToken() 
        const config = {
            headers: {'Authorization': "Bearer " + token}
          };
  
        axios.patch(serverUrl+`admin/users/${param.id}`,param.dataUser,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    });
    
}

export async function postUserAddFunction(param) {
    return new Promise(async (resolve) => {     

        const token = getToken()
        const config = {
            headers: {'Authorization': "Bearer " + token}
          };
  
        axios.post(serverUrl+'admin/users',param.dataUser,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error
            resolve(param);
        })
    });
    
}