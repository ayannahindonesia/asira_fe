import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { AddRoleFunction } from './saga';
import { getToken } from '../index/token';

class RoleAdd extends React.Component{
    _isMounted = false;
    state = {
        diKlik:false,
        errorMessage:'',
        check:false,
        submit:false
       };
    componentDidMount(){
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    btnSave=()=>{
        var name = this.refs.namaRole.value
        var system = this.refs.sistem.value
        var description = this.refs.deskripsi.value
        var status = this.state.check ? "active" :"inactive"
        var permissions =[]
        if(name.trim()==="" || name ===""){
            this.setState({errorMessage:"Nama Role Kosong - Harap Cek Ulang"})
        }else if(system === "0" ){
            this.setState({errorMessage:"Sistem Role Kosong - Harap Cek Ulang"})            
        }else{
            this.setState({submit:true})
            var newData = {name,system,description,status,permissions}
            this.addRole(newData)
        }
    }
    
    addRole = async function (params) {
        const data  = await AddRoleFunction(params)
        if(data){
            if(!data.error){
                swal("Success","Role berhasil di tambah","success")
                this.setState({diKlik:true,submit:false})
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
   
    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-success" value="Simpan" onClick={this.btnSave} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-success" value="Simpan" onClick={this.btnSave}/>
        }
    }
    handleChecked = () =>{
        this.setState({check:!this.state.check})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listrole'/>            
        }
        if(getToken()){
            return(
                <div className="container mt-4">
                 <h3>Role - Tambah</h3>
                 
                 <hr/>
                 <div className="form-group row">
                        <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                {this.state.errorMessage}
                        </div>
                            
                 </div>
                 <form>
                            <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Nama Role</label>
                            <div className="col-sm-10">
                                <input type="text" required className="form-control" ref="namaRole" placeholder="Input Role.." />
                            </div>
                            
                            </div>
                            <div className="form-group row">
                            
                            <label className="col-sm-2 col-form-label">Sistem</label>
                            <div className="col-sm-10">
                                <select ref="sistem" className="form-control">
                                <option value={0}>====== Pilih Sistem =====</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Core">Core</option>
                                <option value="Dashboard">Dashboard</option>
                            </select>
                            </div>
                            </div>

                            <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Deskripsi</label>
                            <div className="col-sm-10">
                                <textarea  rows= {6} ref="deskripsi" className="form-control"  placeholder="Description.." required autoFocus/>
                            </div>
                            </div>

                            <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Status</label>
                            <div className="col-sm-10">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" value="active" type="checkbox" onChange={this.handleChecked} defaultChecked={this.state.check}/> 
                            <label style={{position:"relative",left:"17%",paddingTop:"3px"}} >{ this.state.check ? "Aktif" : "Tidak Aktif" }</label>            
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
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default RoleAdd;