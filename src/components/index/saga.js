import axios from 'axios'
import jsonWebToken from 'jsonwebtoken'
import {serverUrl, serverUrlBorrower} from '../url'
import { setTokenClient, setTokenBorrower, getTokenAuth, getTokenClient } from './token'

export async function postLoginBankDashboardFunction (param, next, nextProfile) {
    return new Promise(async (resolve)=>{
        const tokenAuth = getTokenAuth();

        const config = {
            headers: {'Authorization': "Bearer " + tokenAuth}
        };

        let newLink = serverUrl+`client/lender_login`;  
        const logindata ={key: param.key,password: param.password};
          
        axios.post(newLink, logindata, config)
        .then((res)=>{
            param.dataTokenLender = res.data.token;
            delete param.password;

            setTokenClient(res.data.token, new Date().getTime() + (res.data.expires_in*1000))

            if(next){
                resolve(next(param, nextProfile))
            }
            resolve(param)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
    
}

export async function getTokenBorrowerFunction (param, next) {
    return new Promise(async (resolve)=>{
        let newLink = serverUrlBorrower +`clientauth`;  
        const logindata = {
            auth: {
                username : 'androkey',
                password : 'androsecret'
            }
        };
          
        axios.get(newLink, logindata)
        .then((res)=>{          
            param.dataTokenBorrower = res.data.token;

            setTokenBorrower(res.data.token);

            if(next){
                resolve(next(param))
            }
            resolve(param)
        })
        .catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
    })
    
}

export async function getUserProfileFunction(param, next) {
    return new Promise(async (resolve) => {    
       
        const newLink = serverUrl + 'lender/profile'

        const config = {
            headers: {'Authorization': "Bearer " + getTokenClient()}
        };

        axios.get(newLink, config).then((res)=>{       
            var token = jsonWebToken.verify(param.dataTokenLender,'sXQ8jUMpueOvN5P3cdCR');
            token.name = res.data && res.data.name;
            token.image = res.data && res.data.image;
            token.firstLogin = res.data && res.data.first_login;

            param.dataPermission = token;


            if(next){
                resolve(next(param))
            }
            resolve(param)
        }).catch((err)=>{
            const error = err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`
            param.error = error;
            resolve(param);
        })
        
    });
    
}


export async function sendEmailFunction (param,next){
    return new Promise(async (resolve)=>{
        const tokenAuth = getTokenAuth();

        const config = {
            headers: {'Authorization': "Bearer " + tokenAuth}
        };
        axios.post(serverUrl+'client/forgotpassword',param,config)
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

export async function changePasswordFunction (param,next){
    return new Promise(async(resolve)=>{
        const tokenAuth = getTokenAuth();

        const config = {
            headers: {'Authorization': "Bearer " + tokenAuth}
        };
        axios.post(serverUrl+'client/resetpassword',param,config)
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

export async function changeFirstLoginFunction (param,next){
    return new Promise(async(resolve)=>{
        const tokenClient = getTokenClient();

        const config = {
            headers: {'Authorization': "Bearer " + tokenClient}
        };
        axios.post(serverUrl+'lender/first_login',param,config)
        .then((res)=>{
            if(next){
                resolve(next(param))
            }
            resolve(res)
        })
        .catch((err)=>{
            console.log(err.response)
            const error =( err.response && err.response.data && err.response.data.message && `Error : ${err.response.data.message.toString().toUpperCase()}`)|| err.toString()
            param.error = error;
            resolve(param);
        })
    })
}


