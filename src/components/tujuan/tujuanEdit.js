import React from 'react'
import '../../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
import {TujuanDetailFunction, TujuanEditFunction} from './saga'
import swal from 'sweetalert'
import { getToken } from '../index/token'

class TujuanEdit extends React.Component{
    _isMounted = false
    state={
        errorMessage:'',
        diKlik:false,
        rows:[],check:true,submit:false
    }

    componentDidMount(){
        this._isMounted = true
        this.getTujuanDetailByID()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    getTujuanDetailByID = async function(){
        var id = this.props.match.params.id
        const param = {
            id
        }
        const data = await TujuanDetailFunction(param)
        if(data){
            if(!data.error){
                this.setState({rows:data,check:data.status==="active"?true:false})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    btnUpdateLayanan = ()=>{
        this.setState({submit:true})
        var name =this.refs.tujuan.value ? this.refs.tujuan.value : this.refs.tujuan.placeholder
        var status = this.state.check?"active":"inactive"
        var id = this.props.match.params.id
            
        if(name==="" || name.trim()===""){
            this.setState({errorMessage:"Tujuan field Kosong -  Harap cek ulang"})
        }else{
                var newData={name,status}
                const param = {
                    id, newData
                }
                this.getEditTujuan(param)
            }
    }
    getEditTujuan = async function(param){
        const data = await TujuanEditFunction(param)
        if(data){
            if(!data.error){
                swal("Success","Tujuan berhasil diubah","success")
                this.setState({errorMessage:null,diKlik:true,submit:false})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    
    handleChecked = () => {
        this.setState({check : !this.state.check})
    }
    btnCancel = ()=>{
        this.setState({diKlik:true})
    }
    renderBtnSumbit =()=>{
        if( this.state.submit) {
            return <input type="button" disabled className="btn btn-success ml-3 mr-3" value="Ubah" onClick={this.btnUpdateLayanan} style={{cursor:"wait"}}/>
        }else{
             return <input type="button" className="btn btn-success ml-3 mr-3" value="Ubah" onClick={this.btnUpdateLayanan}/>
     
        }
     }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listtujuan'/>            

        }
        if(getToken()){
            return(
                <div className="container">
                   <h2 className="mt-3">Tujuan Pembiayaan - Edit</h2>
                  
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>   
                    </div>
                   <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Tujuan Pembiayaan</label>
                            <div className="col-sm-9">
                            <input type="text" placeholder={this.state.rows.name} style={{width:"50%",marginLeft:"100px",height:"35px",borderRadius:"3px"}} ref="tujuan"></input>                            
                            </div>
                    </div>
                  
                
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" type="checkbox" onChange={this.handleChecked} checked={this.state.check} /> 
                            <label style={{position:"relative",left:"18%",paddingTop:"3px"}}>{this.state.check ? 'Aktif' : 'Tidak Aktif'}</label>           
                            </div>
                    </div>
                    
                    <div className="form-group row">
                            {this.renderBtnSumbit()}
                            <input type="button" className="btn btn-warning" value="Batal" onClick={this.btnCancel}/>

                    </div>
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

export default TujuanEdit;