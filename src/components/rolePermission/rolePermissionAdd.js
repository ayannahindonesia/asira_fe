import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import CheckBoxClass from '../subComponent/CheckBox';
import DropDown from '../subComponent/DropDown';
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getAllRoleFunction, patchRolePermissionFunction } from './saga'
import { constructRolePermission, checkingSystem, checkingRole, findRoleName, findSystem } from './function'
import { getToken } from '../index/token';

const styles = (theme) => ({
  container: {
    flexGrow: 1,
  },
});



class rolePermissionAdd extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission: [],
      listRolePermission: [],
      disabled: false,
      role : 0,
      nameRole: '',
      system: '',
      listRole: [],
      loading: true,
    };

    componentDidMount(){
      this._isMounted = true;
      this.refresh()
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {};

      const data = await getAllRoleFunction(param);

      if(data) {
        if(!data.error) {
          const listRole = [];
          const dataRole = data.dataRole;
          let role = 0;

          for(const key in dataRole) {
            if(!dataRole[key].permissions || (dataRole[key].permissions && dataRole[key].permissions.length === 0)) {
              listRole.push(dataRole[key]);
              role = dataRole[key].id;
            }
          }

          if(listRole.length !== 0) {
            this.setState({
              listRole,
              role,
              system: findSystem(role, listRole),
              nameRole: findRoleName(role, listRole),
              listAllRolePermission:checkingSystem(role,listRole),
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: 'Data Role yang belum di setup tidak ditemukan',
              disabled: true,
              loading: false,
            })
          }
          
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave = () => {
      if(this.state.listRolePermission.length === 0) {
        this.setState({errorMessage:"ERROR : Data Role Permission Tidak Boleh Kosong"})
      } else if(this.state.listRole.length === 0 || this.state.role === 0) {
        this.setState({errorMessage:"ERROR : Data Role Tidak Boleh Kosong"})
      } else{
        
        this.setState({loading: true})

        const listRolePermission = this.state.listRolePermission;
        const dataRolePermission = {};
        dataRolePermission.id = parseInt(this.state.role);
        dataRolePermission.name = this.state.nameRole;
        dataRolePermission.system = this.state.system;
        dataRolePermission.permissions = constructRolePermission(listRolePermission) || [];

        const param = {
          roleId: parseInt(this.state.role),
          dataRolePermission,
        };
  
        this.postRolePermission(param);
        
      }
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

    postRolePermission = async function (param) {
      const data = await patchRolePermissionFunction(param)

      if(data) {
        if(!data.error) {
          swal("Success","Role Permission berhasil di tambah","success")
          this.setState({
            diKlik: true,
            loading: false,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }

    onChangeCheck = (e) => {
      const profileUserAll = Object.assign({}, this.state.listAllRolePermission);
      const profileUser = Object.assign({}, this.state.listRolePermission);
      const profileUserNew = [];

      let flag = false;
      let modules = '';
  
      for (const key in profileUserAll) {
        if (
          profileUserAll[key].id.toString().trim() ===
          e.target.value.toString().trim()
        ) {
          modules = profileUserAll[key].modules;

          for(const keyRole in profileUser) {
            if(profileUser[keyRole].id.toString().trim() !== e.target.value.toString().trim()) {
              profileUserNew.push(profileUser[keyRole])
            } else {
              flag = true;
            }
          }
        } 
      }
  
      if (!flag) {
        const modulesSplit = modules.split(' ');

        for(const key in modulesSplit) {
          profileUserNew.push({
            id: e.target.value,
            modules: modulesSplit[key],
          });
        } 
      }
      
      this.setState({
        listRolePermission: profileUserNew,
      });
    };

    onChangeDropDown = (e) => {
      this.setState({
        role: e.target.value,
        system: findSystem(e.target.value, this.state.listRole),
        nameRole: findRoleName(e.target.value, this.state.listRole),
        listAllRolePermission: checkingSystem(e.target.value,this.state.listRole)
      })
    }

    render(){
        if(this.state.diKlik){
          return <Redirect to='/listRolePermission'/>            
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
                <h3>Role Permission - Tambah</h3>
                
                <hr/>
                
                <form>
                  <div className="form-group row">                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Role Name
                      </label>
                      <div className="col-sm-4">
                        <DropDown
                          value={this.state.role}
                          label="Role"
                          data={this.state.listRole}
                          id="id"
                          labelName="name-system"
                          onChange={this.onChangeDropDown}
                          fullWidth
                          error={this.state.roleHelper}
                          disabled={this.state.disabled}
                        />
                      </div>                 
                  </div>

                  <div className="form-group row">
                      <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                        {this.state.errorMessage}
                      </div>     
                      <div className="col-12" style={{color:"black",fontSize:"15px",textAlign:'left'}}>
                        <CheckBoxClass
                          label={`${this.state.system} - Permission Setup`}
                          modulesName="Menu"
                          data={this.state.listAllRolePermission}
                          id="id"
                          labelName="label"
                          modules="menu"      
                          labelPlacement= "top"                       
                          onChange={this.onChangeCheck}
                          onChecked={(id) => checkingRole(this.state.listRolePermission, id)}
                          style={{ width: '97%'}}
                          disabled={this.state.disabled}
                        />
                      </div>           
                  </div>
                  
                  <div className="form-group row">
                      <div className="col-sm-12 ml-3 mt-3">
                        <input type="button" value="Simpan" className="btn btn-success" onClick={this.btnSave} disabled={this.state.disabled}/>
                        <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
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
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
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
  )(rolePermissionAdd);