import React from 'react'
import { Grid, Button, TextField } from '@material-ui/core'
import './../../support/css/login.css'
import { Redirect  } from 'react-router-dom'
import swal from 'sweetalert'
import { changePasswordFunction, changeFirstLoginFunction} from './saga'

import Loader from 'react-loader-spinner'

class changePassword extends React.Component{
    _isMounted = false

    state = {
        loading:false,
        errorMessage:'',
        diKlik:false,password1:'',password2:''
    }

    componentDidMount(){
        this._isMounted=true
    }

    componentWillUnmount(){
        this._isMounted=false
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    btnChangePassword = ()=>{   
    this.setState({loading:true})

    const password1 = this.state.password1
    const password2 = this.state.password2

    if(password1.toLowerCase() !== password2.toLowerCase()){
        this.setState({errorMessage:"Password tidak sesuai - Harap periksa kembali",loading:false})
    }else if(password1.trim()==='' || password2.trim()===''){
        this.setState({errorMessage:"Field ada yang kosong - Harap periksa kembali",loading:false})
    }else {
        
        if(!this.props.type) {
            const arr =  window.location.href.split("?")

            if (arr.length>1){
                const token = arr[1].slice(arr[1].indexOf('=')+1,arr[1].length)
                
                const param = {
                    token,
                    password:password1
                }
                this.changePass(param)
            }else{
               this.setState({errorMessage:"Token kosong/ Invalid"})
            }
        } else {
            const param = {
                password:password1
            }
            this.changePass(param)
        }
        
    }

    }
    
    handleChangeTextField = (e) => {
        const label = e.target.id;

        this.setState({
            [label] : e.target.value,
        })
    }

     changePass = async function (param){
         const data = this.props.type && this.props.type === 'firstlogin' ? await changeFirstLoginFunction(param) : await changePasswordFunction (param)
         if(data){
             if(!data.error){
                localStorage.clear();
                swal("Berhasil","Password berhasil dirubah","success")
                this._isMounted && this.setState({errorMessage:null,diKlik:true})
             }else{
                this._isMounted && this.setState({errorMessage:data.error,loading:false})
             }
         }

     }
    renderBtnOrLoading =()=>{
        if (this.state.loading){
            return ( 
                <Button disableElevation color="primary"
                variant='contained'
                style={{backgroundColor: '#20B889', width:'70%', color:'white'}}
                >
                    <Loader 
                    type="ThreeDots"
                    color="#00BFFF"
                    height="10"	
                    width="10"
                />   
                </Button>
            );
        }
        else{
            return(
                <Button disableElevation
                variant='contained'
                style={{backgroundColor: '#20B889', width:'70%', color:'white'}}
                onClick={this.btnChangePassword}>
                    <b>Ubah Password</b>
                </Button>
            )
        }
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/'/>            
        }
        return(
            <Grid container>
                    <Grid item xs={12} sm={4}>
                        
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Grid container className='loginContainer'>
                            <Grid item xs={12} sm={12} style={{textAlign:'center'}}>
                                <img src={require('./../../icons/LogoAsira.png')} alt='' style={{width:'60%'}} />
                            </Grid>
                            <Grid item xs={12} sm={12}  className='loginBox'>
                                <Grid container>
                                    <Grid item xs={12} sm={12} style={{marginTop:20}}>
                                        <h5>Ubah Password </h5>
                                        <div style={{color:"red",fontSize:"10px"}}>
                                                {this.state.errorMessage}
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} style={{marginTop:20}}>
                                        <TextField
                                            id={'password1'}
                                            type='password'
                                            size="small"
                                            margin="dense"
                                            variant='outlined'
                                            style={{width:"70%"}}
                                            label={'Password Baru'}
                                            value={this.state.password1}
                                            onChange={this.handleChangeTextField}
                                        /> 
                                    </Grid>
                                    <Grid item xs={12} sm={12} style={{marginTop:10}}>
                                        <TextField
                                            id={'password2'}
                                            type='password'
                                            size="small"
                                            margin="dense"
                                            variant='outlined'
                                            style={{width:"70%"}}
                                            label={'Konfirmasi Password Baru'}
                                            onKeyPress={this.handleEnter}
                                            value={this.state.password2}
                                            onChange={this.handleChangeTextField}
                                        />  
                                        
                                    </Grid>

                                    <Grid item xs={12} sm={12} style={{marginTop:20}}>
                                        {this.renderBtnOrLoading()}
                                        
                                    </Grid>
                                    <Grid item xs={12} sm={12} style={{marginTop:20, marginBottom:20}}>
                                        <img src={require('./../../icons/powered.svg')} alt='' style={{width:'30%'}} />
                                    </Grid>
                                </Grid>
                                
                            </Grid>
                        </Grid>
                        
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        
                    </Grid>

                  
                </Grid>
        )
    }
}

export default changePassword;