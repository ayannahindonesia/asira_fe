import React from 'react'
import { Redirect } from 'react-router-dom'
import CheckBoxClass from '../subComponent/CheckBox';
import Loader from 'react-loader-spinner'
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getRoleFunction, patchRolePermissionFunction } from './saga'
import { constructRolePermission, checkingRole, checkingSystem } from './function'
import { getToken } from '../index/token';
import { destructRolePermission } from './function';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });


class rolePermissionEdit extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      listAllRolePermission: [],
      listRolePermission: [],
      listRole : {},
      roleId: 0,
      nameRole: '',
      system: '',
      loading: true,
      disabled:true,
    };

    componentDidMount(){
      this._isMounted = true;
      this.setState({
        roleId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
    }
    
    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {};
      param.roleId = this.state.roleId;

      const data = await getRoleFunction(param);

      if(data) {
          const listRolePermission = destructRolePermission((data.dataRole && data.dataRole.permissions) || [])
          
          if(!data.error) {
            this.setState({
              listRole: data.dataRole,
              nameRole: data.dataRole.name,
              system: data.dataRole.system,
              listRolePermission,
              listAllRolePermission: checkingSystem(this.state.roleId, [data.dataRole]),
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

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }
    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave = () =>{ 
      this.setState({loading: true})

      const listRolePermission = this.state.listRolePermission;
      const dataRolePermission = {};
      
      dataRolePermission.id = parseInt(this.state.listRole.id);
      dataRolePermission.name = this.state.nameRole;
      dataRolePermission.system = this.state.system
      dataRolePermission.permissions = constructRolePermission(listRolePermission);

      const param = {
        roleId: parseInt(this.state.listRole.id),
        dataRolePermission,
      };
      
      this.patchRolePermission(param)
        
    }

    patchRolePermission = async function(param) {
      const data = await patchRolePermissionFunction(param)

      if(data) {
        if(!data.error) {
          swal("Success","Role Permission berhasil di ubah","success")
          this.setState({
            diKlik: true,
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
              <h3>Role Permission - Ubah</h3>
              
              <hr/>
              
              <form>
                <div className="form-group row">                   
                  <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                    Role Name
                  </label>
                  <label className="col-sm-4 col-form-label" style={{lineHeight:3.5}}>
                    {this.state.listRole && this.state.listRole.name}
                  </label>               
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
                        />
                    </div>           
                </div>
                
                <div className="form-group row">
                    <div className="col-sm-12 ml-3 mt-3">
                      <input type="button" value="Ubah" className="btn btn-success" onClick={this.btnSave} />
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
  // menu: getMenu(),
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
  )(rolePermissionEdit);