import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { EditRoleFunction, DetailRoleFunction } from './saga';
import { getToken } from '../index/token';

class RoleEdit extends React.Component{
    state = {
        diKlik:false,
        dataRole:'',
        check:true
    };
    _isMounted = false;
    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this._isMounted = true;
        this.getDetailRoleByID()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    
    getDetailRoleByID = async function () {
        const id = this.props.match.params.id
        const param ={id}
        const data = await DetailRoleFunction (param)
        if(data){
            if(data.error){
                this.setState({errorMessage:data.error})
            }else{
                this.setState({dataRole:data.data,check:data.data.status && data.data.status === 'active' ? true : false})
            }
        }

    }
    btnEdit = ()=>{
        var id = this.props.match.params.id
        var description = this.refs.deskripsi.value ?  this.refs.deskripsi.value :  this.refs.deskripsi.placeholder
        var status =  this.state.check
        status ? status= "active": status= "inactive"
        var newData = {description,status}
        const param = {
            id,newData
        }
        this.setState({submit:true})
        this.editRole(param)
    }

    editRole = async function (params) {
        const data = await EditRoleFunction(params)
        if(data){
            if(data.error){
                this.setState({errorMessage:data.error,submit:false})
            }else{
                swal("Success","Role berhasil di Edit","success")
                this.setState({diKlik:true,submit:false})
            }
        }
    }
    
    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-success" value="Simpan" onClick={this.btnEdit} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-success" value="Simpan" onClick={this.btnEdit}/>
        }
    }
    handleChecked = () =>{
        this.setState({check:!this.state.check})
    }
    render(){
        console.log(this.state.dataRole)
        if(this.state.diKlik){
            return <Redirect to='/listrole'/>            
        }
        if(getToken()){
            return(
                <div className="container mt-4">
                 <h3>Role - Edit</h3>
                 <hr/>
                 <form>
                             <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Role Id</label>
                            <div className="col-sm-10">
                                <input disabled type="text" required className="form-control" ref="namaRole" placeholder={this.state.dataRole.id} />
                            </div>
                            
                            </div>
                            <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Nama Role</label>
                            <div className="col-sm-10">
                                <input disabled type="text" required className="form-control" ref="namaRole" placeholder={this.state.dataRole.name} />
                            </div>
                            
                            </div>
                            <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Sistem</label>
                            <div className="col-sm-10">
                            <input disabled type="text" required className="form-control" ref="namaRole" placeholder={this.state.dataRole.system} />
                            </div>
                            </div>

                            <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Deskripsi</label>
                            <div className="col-sm-10">
                                <textarea  rows= {6} ref="deskripsi" className="form-control"  placeholder={this.state.dataRole.description} required autoFocus/>
                            </div>
                            </div>

                            <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-10">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" type="checkbox" onChange={this.handleChecked} checked={this.state.check} /> 
                            <label style={{position:"relative",left:"18%",paddingTop:"3px"}}>{this.state.check ? 'Aktif' : 'Tidak Aktif'}</label>        
                            </div>

                            <div className="form-group row">
                            <div className="col-sm-12 ml-3 mt-3">
                                                {this.renderBtnSumbit()}
                                                <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                             </div></div>
                    </div>
                 </form>
                
                </div>
            )
        }
        if(!getToken())
        {
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default RoleEdit;