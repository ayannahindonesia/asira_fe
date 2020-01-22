import React from 'react'
import swal from 'sweetalert'
import PhoneInput from 'react-phone-number-input'
import { Redirect  } from 'react-router-dom'
import { getToken } from '../index/token';
import './../../support/css/penyediaAgent.css'
import { getPenyediaAgentDetailFunction, editPenyediaAgentFunction } from './saga';
import Loader from 'react-loader-spinner'

class PenyediaEdit extends React.Component{
    state = {
        diKlik:false,
        phone:'',
        submit:false,
        check:false,
        rows:[],
        loading:true
    };

    _isMounted = false;

    componentDidMount(){
        this.getDetailAgent()
        this._isMounted = true;
    }
    getDetailAgent = async function () {
        const id =this.props.match.params.id

        const data = await getPenyediaAgentDetailFunction({id})

        if(data){
            if(!data.error){
                this.setState({
                    rows:data.dataAgentDetail,
                    check:data.dataAgentDetail.status ==="active"?true:false,
                    loading:false
                })
            }else{
                this.setState({errorMessage:data.error,loading:false})
            }

        }
        
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    handleChecked=(e)=>{
        this.setState({check:!this.state.check})
    }


    renderBtnSumbit =()=>{
        if( this.state.submit) {
        return <input type="button" disabled className="btn btn-primary" value="Ubah" onClick={this.btnEditAgen} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-primary" value="Ubah" onClick={this.btnEditAgen}/>
        }
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    btnEditAgen =()=>{
        let status = this.state.check ? "active": "inactive"
        let address = this.refs.alamat.value ? this.refs.alamat.value : this.refs.alamat.placeholder
        let pic = this.refs.pic.value ? this.refs.pic.value :this.refs.pic.placeholder
        let phone = this.state.phone ? String(this.state.phone):String(this.state.rows.phone)

        if(pic.trim().length ===0){
            this.setState({errorMessage:"Nama PIC Kosong - Harap cek kembali"})
        }else if(address.trim().length ===0){
            this.setState({errorMessage:"Alamat Kosong - Harap cek kembali"})
        }else{
            this.setState({submit:true})
            const param ={
                id :this.props.match.params.id,
                newData:{
                    pic,phone,status,address
                }
            }

            this.editPenyediaAgent(param)
           
        }
    }

    editPenyediaAgent = async function (params) {
        const data = await editPenyediaAgentFunction(params)
        if(data){
            if(!data.error){
                this.setState({diKlik:true})
                swal("Berhasil","Penyedia Agent Berhasil di ubah","success")
            }else{
                this.setState({submit:false})
                swal("Tidak Berhasil",`Nomor Telp sudah terdaftar atau ada masalah di server\nSilahkan dicoba kembali`,"error")

            }
        }
    }
    render(){
        if(this.state.loading){
          
            return (
                <div className="mt-2">
                 <Loader 
                    type="ThreeDots"
                    color="#00BFFF"
                    height="30"	
                    width="30"
                />  
                </div>
            )
        
    }
        if(this.state.diKlik){
            return <Redirect to='/penyediaList'/>            
        }
        if(getToken()){
            return(
                <div className="container mt-2">
                     <h3>Penyedia Agen - Edit</h3>
                        {this.state.errorMessage}
                     <hr/>
                     <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                {this.state.errorMessage}
                            </div>
                     </div>
                    <form>
                        <div className="form-group row">
                                <label className="col-sm-3 col-form-label">Id Penyedia Agen</label>
                                <div className="col-sm-9">
                                    <input type="text" disabled required className="form-control" placeholder={this.state.rows.id} />
                                </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nama Penyedia Agen</label>
                            <div className="col-sm-9">
                                <input type="text" disabled required className="form-control"  placeholder={this.state.rows.name} ref="namaAgent"  />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">PIC</label>
                            <div className="col-sm-9">
                            <input type="text" className="form-control" ref="pic" placeholder={this.state.rows.pic} />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nomor Telepon</label>
                            <div className="col-sm-9">
                            <PhoneInput
                            country="ID"
                            placeholder={this.state.rows.phone}
                            value={ this.state.phone }
                            onChange={ phone => this.setState({ phone }) } className="form-control" />                                                  
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Alamat</label>
                            <div className="col-sm-9">
                            <textarea rows="5" ref="alamat" className="form-control"  placeholder={this.state.rows.address} required autoFocus/>
                            
                            </div>
                        </div>
                      
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            <input className="form-check-input" id="checkbox" type="checkbox" onChange={this.handleChecked} checked={this.state.check} /> 
                            <label style={{position:"relative",left:"18%",paddingTop:"3px"}}>{this.state.check ? 'Aktif' : 'Tidak Aktif'}</label>           
                            </div>
                        </div>
                    
                        {this.renderBtnSumbit()}
                        <input type="button" className="btn btn-secondary ml-2" value="Batal" onClick={this.btnCancel}/>
                        
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

export default PenyediaEdit;