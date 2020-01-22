import React from 'react'
import swal from 'sweetalert'
import PhoneInput from 'react-phone-number-input'
import { Redirect  } from 'react-router-dom'
import { getToken } from '../index/token';
import './../../support/css/penyediaAgent.css'
import { addPenyediaAgentFunction } from './saga';


class PenyediaAdd extends React.Component{
    state = {
        diKlik:false,
        phone:'',
        submit:false,
        check:false
    };

    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    
    handleChecked=(e)=>{
        this.setState({check:!this.state.check})
    }


    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-primary" value="Simpan" onClick={this.btnSaveAgen} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-primary" value="Simpan" onClick={this.btnSaveAgen}/>
        }
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    btnSaveAgen =()=>{
        let status = this.state.check ? "active": "inactive"
        let address = this.refs.alamat.value
        let name = this.refs.namaAgent.value
        let pic = this.refs.pic.value
        let phone = this.state.phone

        if(this.state.phone ===''){
            this.setState({errorMessage:"Nomor Telepon Kosong - Harap cek kembali"})
        }else if(name.trim().length ===0){
            this.setState({errorMessage:"Nama Penyedia Agen Kosong - Harap cek kembali"})
        }else if(pic.trim().length ===0){
            this.setState({errorMessage:"Nama PIC Kosong - Harap cek kembali"})
        }else if(address.trim().length ===0){
            this.setState({errorMessage:"Alamat Kosong - Harap cek kembali"})
        }else if(this.state.phone===''){
            this.setState({errorMessage:"Nomor Telepon Kosong - Harap cek kembali"})
        }else{
            this.setState({submit:true})
            const newData = {
                name,pic,phone,address,status
            }
             this.addAgent(newData)
           
        }
    }

    addAgent = async function (params) {
        const data = await addPenyediaAgentFunction(params)
        if(data){
            if(!data.error){
                swal("Berhasil","Agen Berhasil Di Tambah","success")
                this.setState({diKlik:true})
            }else{
                swal("Tidak Berhasil",`Nomor Telp sudah terdaftar atau ada masalah di server\nSilahkan dicoba kembali`,"error")
                this.setState({submit:false})
            }

        }
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/penyediaList'/>            
        }
        if(getToken()){
            return(
                <div className="container mt-2">
                     <h3>Penyedia Agen - Tambah</h3>
                        {this.state.errorMessage}
                     <hr/>
                     <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>
                                
                     </div>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nama Penyedia Agen</label>
                            <div className="col-sm-9">
                                <input type="text" required className="form-control" ref="namaAgent" placeholder="Input Nama Penyedia Agen.." />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">PIC</label>
                            <div className="col-sm-9">
                            <input type="text" className="form-control" ref="pic" placeholder="Input Nama PIC.." />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nomor Telepon</label>
                            <div className="col-sm-9">
                            <PhoneInput
                            country="ID"
                            placeholder="Masukan nomor telp.."
                            value={ this.state.phone }
                            onChange={ phone => this.setState({ phone }) } className="form-control" />                                                  
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Alamat</label>
                            <div className="col-sm-9">
                            <textarea rows="5" ref="alamat" className="form-control"  placeholder="Alamat tempat tinggal terakhir.." required autoFocus/>
                            
                            </div>
                        </div>
                      
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            <input className="form-check-input" id="checkbox" type="checkbox" onChange={this.handleChecked} defaultChecked={this.state.check} /> 
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

export default PenyediaAdd;