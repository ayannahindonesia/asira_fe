import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert'
import { DetailTipeBankFunction,EditTipeBankFunction } from './saga';
import { getToken } from '../index/token';


class TypeBankEdit extends React.Component{
    state={diKlik:false,errorMessage:'',rows:[],submit:false}
    _isMounted = false
    
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error,rows:[]})
    }
    componentDidMount(){
        this._isMounted = true;
        this.getDataBankTypebyID()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    getDataBankTypebyID = async function (){
        var id = this.props.match.params.id
        const param = {id}
        const data = await DetailTipeBankFunction(param)
        if(data){
            if(!data.error){
                this.setState({rows:data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnUpdate} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-success ml-3 mr-3" value="Simpan" onClick={this.btnUpdate}/>
        }
    }
    btnUpdate=()=>{
        var name= this.refs.typebank.value
        var description = this.refs.deskripsi.value ? this.refs.deskripsi.value :this.refs.deskripsi.placeholder
        var id = this.props.match.params.id
        this.setState({submit:true})
        var newData={name,description}
        const params = {id,newData}
        this.EditTypeBankBtn(params)
    }

    EditTypeBankBtn = async function (params) {
        const data = await EditTipeBankFunction(params)
        if(data){
            if(!data.error){
                swal("Success","Bank Type berhasil di ubah","success")              
                this.setState({diKlik:true,errorMessage:'',submit:false})
            }else{
                this.setState({submit:false,errorMessage:data.error})
            }
        }

        
    }
    btnCancel =()=>{
        this.setState({diKlik:true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to="/listtipe"/>
        }
        if(getToken())
        {
            return(
                <div className="container mt-3">
                  <h2>Tipe Bank -  Ubah</h2>
                <hr></hr>
                <div className="form-group row">
                 <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                     {this.state.errorMessage}
                  </div>
                </div>
                     <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">ID Tipe Bank</label>
                                                <div className="col-sm-9 btn-group">
                                                <input disabled type="text" className="form-control" ref="typebank" defaultValue={this.state.rows.id} required autoFocus/>
                                                </div>
                     </div>
                     <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Nama Tipe Bank</label>
                                                <div className="col-sm-9 btn-group">
                                                <input disabled type="text" className="form-control" ref="typebank" defaultValue={this.state.rows.name} required autoFocus/>
                                                </div>
                     </div>
                      <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Deskripsi</label>
                                                <div className="col-sm-9">
                                                <textarea rows="5" ref="deskripsi" className="form-control" placeholder={this.state.rows.description} required autoFocus/>
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

export default TypeBankEdit;