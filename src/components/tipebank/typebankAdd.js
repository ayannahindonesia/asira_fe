import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { AddTipeBankFunction } from './saga';
import { getToken } from '../index/token';

class TypeBank extends React.Component{
    _isMounted = false;
    state={diKlik:false,errorMessage:'',submit:false}
    
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this._isMounted = true;
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    btnSave=()=>{
        var name= this.refs.typebank.value
        var description = this.refs.deskripsi.value
  
        if (name ===""||name.trim()===""){
            this.setState({errorMessage:"Nama Tipe Bank Kosong - Harap cek ulang"})
        }else{
            this.setState({submit:true})
            var newData={name,description}
            this.AddTypeBank(newData)
        }
    }

    AddTypeBank = async function (params) {
        const data = await AddTipeBankFunction(params)
        if(data){
            if(!data.error){
                this.setState({submit:false,diKlik:true,errorMessage:""})
                swal("Success","Tipe Bank Berhasil di Tambah","success")
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnSave} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnSave}/>
        }
    }
    btnCancel =()=>{
        this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to="/listtipe"/>
        }
        if(getToken()){
            return(
                <div className="container mt-3">
                  <h2>Tipe Bank -  Tambah</h2>
                <hr></hr>
                <div className="form-group row">
                 <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                     {this.state.errorMessage}
                  </div>
                </div>
                     <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Nama Tipe Bank</label>
                                                <div className="col-sm-9 btn-group">
                                                <input type="text" className="form-control" ref="typebank" placeholder="Nama Tipe Bank.." required autoFocus/>
                                                </div>
                     </div>
                      <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Deskripsi</label>
                                                <div className="col-sm-9">
                                                <textarea rows="5" ref="deskripsi" className="form-control"  placeholder="Description.." required autoFocus/>
                                                </div>
                     </div>
                    <div className="form-group row">
                                                {this.renderBtnSumbit()}
                                                <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
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

export default TypeBank;