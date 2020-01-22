import axios from 'axios';
import { serverUrl } from '../url'
import { getToken } from '../index/token';

export async function getAllRoleFunction(param, next){
    return new Promise(async (resolve) => {
        const token = getToken();
       
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        let filter = '';

        for(const key in param) {
            filter += `&${key}=${param[key]}`
        }

        const urlNew = serverUrl+`admin/roles_all?orderby=updated_at&sort=desc${filter}`

        axios.get(urlNew,config).then((res)=>{
            const listRole = res.data && res.data.data ? res.data.data : res.data
            param.dataRole = listRole;

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

export async function getRoleFunction(param, next) {
    return new Promise(async (resolve) => {
        const token = getToken()
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        axios.get(serverUrl+`admin/roles/${param.roleId}`,config).then((res)=>{
            const listRole = res.data;
            param.dataRole = listRole;

            if(next) {
                resolve(next(param));
            } else {
                resolve(param);
            }
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error
            resolve(param);
        })
    });
}

export async function getPermissionFunction(param, next) {
    return new Promise(async (resolve) => {
        const token = getToken()
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };
          
        axios.get(serverUrl+`admin/permission?role_id=${param.roleId}`,config)
        .then((res)=>{
            const listPermission = res.data && res.data.data ? res.data.data : res.data;

            param.dataPermission = listPermission;
    
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

export async function patchRolePermissionFunction(param) {
    return new Promise(async (resolve) => {
        const token = getToken();
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        axios.patch(serverUrl+`admin/roles/${param.roleId}`,param.dataRolePermission,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    })
}

export async function postRolePermissionFunction(param) {
    return new Promise(async (resolve) => {
        const token = getToken(); 
        const config = {
            headers: {'Authorization': "Bearer " + token}
        };

        axios.post(serverUrl+`admin/permission`,param.dataRolePermission,config).then((res)=>{
            resolve(res)
        }).catch((err)=>{
            const error = (err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`) || err.toString()
            param.error = error;
            resolve(param);
        })
    })
}