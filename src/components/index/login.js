import React from 'react'
import './../../support/css/login.css'
import Loader from 'react-loader-spinner'
import swal from 'sweetalert'
import {Redirect} from 'react-router-dom'
import { postLoginBankDashboardFunction, getUserProfileFunction ,sendEmailFunction} from './saga'
import { setProfileUser } from './token'
import { Grid, Button, TextField } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CookiesNotification from './cookiesCard'

 
class Login extends React.Component{
    _isMounted = false;

    state={
        loading:false, 
        isLogin:false,
        username: '',
        password: '',
        open:false, loadMail:false,
        email:'',
        error:''
    }

    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;     
    }
  
    //LOGIN BUTTON
    btnLogin = ()=>{
        this.setState({loading:true})

        var username=this.state.username
        var password=this.state.password

        const param = {
            key: username,
            password
        }

        if (username==="" || password===""){
            swal("Error","Username dan Password Kosong","error")
            this.setState({loading:false})

        }else{
            this.postLogin(param)
        }
      
    } 
    
    postLogin = async function (param) {
        const data = await postLoginBankDashboardFunction(param, getUserProfileFunction)

            if(data) {
                if(!data.error) {
                    let userPermission = data.dataPermission || {};  
                
                    setProfileUser(JSON.stringify(userPermission))

                    this.setState({loading:false , isLogin : true})
                } else {
                    this.setState({loading:false})
                    swal("Gagal Login","Cek ulang Username dan Password","info")
                }
            }
    }
    
    //Forgot Password

    handleOpen = ()=>{
        this.setState({open:true})
    }
    handleClose = ()=>{
        this.setState({open:false})
    }
    handleEmail=(e)=>{
        this.setState({email:e.target.value})
        
    }
    handleSend=()=>{
        this.setState({loadMail:true})
        if(!(this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))){
            this.setState({error:"Masukan format email yang benar",loadMail:false})
        }else{
            let newData = {
                email:this.state.email
            }
            this.sendEmail(newData)
        }
    }
    sendEmail = async function (params){
        const data = await sendEmailFunction (params)
        if(data){
            if(!data.error){
                swal("Email Terkirim",`Harap cek di ${this.state.email}`,"success")
                this.setState({error:'',open:false,loadMail:false})
            }else{
                this.setState({error:data.error,loadMail:false})
            }
        }
    }


    handleChangeTextField = (e) => {
        const label = e.target.id;

        this.setState({
            [label] : e.target.value,
        })
    }

    handleEnter =(e)=> {
        if (e.charCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            this.btnLogin();
        }
    }

    renderBtnEmail =()=>{
        if(this.state.loadMail){
            return(
                <Button disableElevation color="primary">
                    <Loader 
                        type="ThreeDots"
                        color="#00BFFF"
                        height="10"	
                        width="10"
                    />   
                </Button>
            )
        }
        else{
            return(
                <Button disableElevation onClick={this.handleSend} color="primary">
                    <b>Kirim</b>
                </Button>
            )
        }
    }

    render(){
        if(this.state.isLogin){
            return(
                <Redirect to='/' />
            )
        }
       

        return (
            <Grid container style={{ display:'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CookiesNotification />

                <Grid item xs={4} sm={4}>
                    <Grid container className='loginContainer'>
                        <Grid item xs={12} sm={12} style={{textAlign:'center'}}>
                            <img src={require('./../../icons/LogoAsira.png')} alt='' style={{width:'60%'}} />
                        </Grid>
                        <Grid item xs={12} sm={12}  className='loginBox'>
                            <Grid container>
                                <Grid item xs={12} sm={12} style={{marginTop:20}}>
                                    <h5>Mitra Dashboard</h5> 
                                </Grid>
                                <Grid item xs={12} sm={12} style={{marginTop:20}}>
                                    <TextField
                                        id={'username'}
                                        size="small"
                                        margin="dense"
                                        variant='outlined'
                                        style={{width:"70%"}}
                                        label={'Username'}
                                        value={this.state.username}
                                        onChange={this.handleChangeTextField}
                                    /> 
                                </Grid>
                                <Grid item xs={12} sm={12} style={{marginTop:10}}>
                                    <TextField
                                        id={'password'}
                                        type='password'
                                        size="small"
                                        margin="dense"
                                        variant='outlined'
                                        style={{width:"70%"}}
                                        label={'Password'}
                                        onKeyPress={this.handleEnter}
                                        value={this.state.password}
                                        onChange={this.handleChangeTextField}
                                    />  
                                    
                                </Grid>

                                <Grid item xs={12} sm={12} style={{fontSize:'12px' ,paddingRight:'15%', marginTop:5, textAlign:'right'}}>
                                    <label style={{cursor:'pointer'}} onClick={this.handleOpen}> Lupa Password ? </label> 
                                </Grid>

                                <Grid item xs={12} sm={12} style={{marginTop:20}}>
                                    {
                                        this.state.loading && 
                                        <Loader 
                                            type="Circles"
                                            color="#00BFFF"
                                            height="50"	
                                            width="50"
                                        />   
                                        
                                    }
                                    {
                                        !this.state.loading && 
                                        <Button disableElevation
                                            variant='contained'
                                            style={{backgroundColor: '#20B889', width:'70%', color:'white'}}
                                            onClick={this.btnLogin}
                                        >
                                            <b>Masuk</b>
                                        </Button>
                                    }
                                    
                                </Grid>
                                <Grid item xs={12} sm={12} style={{marginTop:20, marginBottom:20}}>
                                    <img src={require('./../../icons/powered.svg')} alt='' style={{width:'30%'}} />
                                </Grid>
                            </Grid>
                            
                        </Grid>
                    </Grid>
                    
                </Grid>
                
                <Grid item xs={12} sm={12}>
                    
                </Grid>

                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title"> 
                        Lupa Password? 
                        <div style={{color:"red",fontSize:"10px"}}>
                            {this.state.error}
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Harap isi Email yang sudah terdaftar, Kami akan mengirimkan password anda disana.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Alamat Email"
                            type="email"
                            fullWidth
                            onChange={this.handleEmail}
                            value={this.state.email}
                            
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button disableElevation onClick={this.handleClose} color="primary">
                            <b>BATAL</b>
                        </Button>
                        {this.renderBtnEmail()}
                    </DialogActions>
                </Dialog>
            </Grid>
            
        )

    }
      
       
    
}

export default (Login);
