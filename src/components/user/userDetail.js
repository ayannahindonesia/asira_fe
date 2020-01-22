import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getUserFunction } from './saga'
import { getAllRoleFunction } from '../rolePermission/saga';
import { getToken } from '../index/token';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

class UserDetail extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      dataUser: {},
      userId: 0,
      disabled: true,
      loading: true,
    };

    componentDidMount(){
      this._isMounted = true;

      this.setState({
        userId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
      
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {};
      param.userId = this.state.userId;

      const data = await getUserFunction(param, getAllRoleFunction);
      

      if(data) {
          if(!data.error) {
            const dataUser = data.dataUser || {};
            
            dataUser.role = this.findRole((dataUser && dataUser.roles) || [], data.dataRole || [])

            this.setState({
              dataUser,
              listRole: data.dataRole,
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: data.error,
              disabled: true,
              loading: false,
            })
          }      
      }
    }

    findRole = (roleUser, dataRole) => {
      let role = '';
      for(const keyRole in roleUser) {
          for(const key in dataRole) {
              if(dataRole[key].id === roleUser[keyRole]) {
                  if(role.trim().length !== 0) {
                      role += ', ';
                  }
                  role += `${dataRole[key].name} (${dataRole[key].system})`;
              }
          }
      }
      
      return role;
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    isRoleBank = (role) => {
      let flag = false;
      const dataRole = this.state.listRole;
      
      if(role && role !== 0) {
        for(const key in dataRole) {
          if(dataRole[key].id.toString() === role.toString() && dataRole[key].system.toString().toLowerCase().includes('dashboard')) {
            flag = true;
            break;
          }
        }
        
      } 

      return flag;
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listUser'/>            
        } else if (this.state.loading){
          return  (
            <div  key="zz">
              <div align="center" colSpan={6}>
                <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
              </div>
            </div>
          )
        } else if(getToken()){
            return(
              <div className="container mt-4">
                 <h3>Akun - Detail</h3>
                 
                 <hr/>
                 
                 <form>
                    <div className="form-group row"> 
                      <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                        {this.state.errorMessage}
                      </div>     
                    </div>

                    <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Id Akun
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        {this.state.dataUser && this.state.dataUser.id}
                      </label>               
                    </div>

                    <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Username
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        {this.state.dataUser && this.state.dataUser.username}
                      </label>               
                    </div>

                    <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Password
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        ********
                      </label>               
                    </div>

                    <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Role
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        {this.state.dataUser && this.state.dataUser.role}
                      </label>               
                    </div>

                    {
                      this.isRoleBank(this.state.dataUser && this.state.dataUser.roles && this.state.dataUser.roles[0]) && 
                      <div className="form-group row">                   
                        <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                          Bank
                        </label>
                        <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                          :
                        </label>
                        <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                          {this.state.dataUser && this.state.dataUser.bank_name}
                        </label>               
                      </div>
                    }
                    

                    <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Email
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        {this.state.dataUser && this.state.dataUser.email}
                      </label>               
                    </div>

                    <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Kontak PIC
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        {this.state.dataUser && this.state.dataUser.phone}
                      </label>               
                    </div>

                    <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Status
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                        {this.state.dataUser && this.state.dataUser.status && this.state.dataUser.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                      </label>               
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-12 mt-3">
                        <input type="button" value="Kembali" className="btn" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                      </div>
                    </div>
                    
                 </form>
                
                </div>
            )
        } else if(!getToken()){
          return (
              <Redirect to='/login' />
          )    
        }
       
    }
}

export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
  // menu: getMenu(),
  // fetching: getFetchStatus(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(UserDetail);