import React from 'react';
import './App.css';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {keepLogin} from './1.actions'
import {serverUrl} from './components/url'

import Login from './components/index/login'
import ScrollTop from './components/scrollToTop'
import axios from 'axios'
import { getTokenClient, setTokenAuth, getProfileUser, getTokenAuth} from './components/index/token';
import { Grid } from '@material-ui/core';
import Drawer from './components/subComponent/Drawer';
import ChangePassword from './components/index/changePassword'

class App extends React.Component {
  state ={loading : true}

  componentDidMount(){
    this.getAuth()
  }

  componentDidUpdate() {
    if(!getTokenAuth()) {
      this.getAuth()
    }
  }

  getAuth = ()=>{
    var url =serverUrl+"clientauth"
    axios.get(url ,{
      auth : {
        username : 'reactkey',
        password : 'reactsecret'
      }
    }).then((res)=>{
      setTokenAuth(res.data.token)
      this.setState({loading : false})
    }).catch((err)=>{
      setTimeout(function(){ alert("Coba reload halaman/ cek koneksi internet"); }, 5000);
    })
  }

  checkUbahPasswordLink= (path, token) => {
    let flag = false;

    if(path && token) {
      if(
        path.split('/')[1] && path.split('/')[1] === 'ubahpassword' &&
        token.split('token=')[1] && token.split('token=')[1].length !== 0
      ) {
        flag = true;
      }
    }
    return flag
  }


  render() {
    
    if(this.state.loading){
      return(
        <p> loading ....</p>
      )
    }
    
      return (
      
        <div>
          <ScrollTop>
            <Grid container>
              
              {
                getTokenClient() && getProfileUser() ? 
                JSON.parse(getProfileUser()).firstLogin ?
                  <ChangePassword type='firstlogin'/>
                :
                  <Grid item xs={12} sm={12}>
                    <Drawer/>
                  </Grid>
                : 
                this.checkUbahPasswordLink(this.props.location && this.props.location.pathname, this.props.location && this.props.location.search) ?
                  <ChangePassword />
                :
                  <Login />
              }
              
            </Grid>
          </ScrollTop>
        </div>
     
      );
    
  
     
 
  }
}
  
const mapStateToProps = (state)=>{
  return {
      id : state.user.id

  }
}

export default withRouter(connect(mapStateToProps,{keepLogin}) (App));


