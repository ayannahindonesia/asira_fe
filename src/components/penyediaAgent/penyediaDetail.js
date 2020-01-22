import React from 'react'
import { Redirect  } from 'react-router-dom'
import { getToken } from '../index/token';
import './../../support/css/penyediaAgent.css'
import { getPenyediaAgentDetailFunction } from './saga';
import Loader from 'react-loader-spinner'

class PenyediaDetail extends React.Component{
    state = {
        diKlik:false,
        phone:'',
        submit:false,
        check:false,
        rows:{},
        loading:true
    };

    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;
        this.getDetailAgent()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    getDetailAgent = async function () {
        const id =this.props.match.params.id

        const data = await getPenyediaAgentDetailFunction({id})

        if(data){
            if(!data.error){
                this.setState({ rows:data.dataAgentDetail,loading:false })
            }else{
                this.setState({errorMessage:data.error,loading:false})
            }

        }
        
    }
    
    btnCancel = ()=>{
        this.setState({diKlik:true})
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
                     <h3>Penyedia Agen - Detail</h3>
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
                                   : {this.state.rows.id}
                                </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nama Penyedia Agen</label>
                            <div className="col-sm-9">
                                    : {this.state.rows.name}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">PIC</label>
                            <div className="col-sm-9">
                            : {this.state.rows.pic}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nomor Telepon</label>
                            <div className="col-sm-9">
                            : {this.state.rows.phone}                         
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Alamat</label>
                            <div className="col-sm-9">
                            : {this.state.rows.address}
                            </div>
                        </div>
                      
                        <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            : {this.state.rows.status ==="active" ?"Aktif":"Tidak Aktif"}
                            </div>
                        </div>
                    
                   
                        <input type="button" className="btn btn-secondary" value="Kembali" onClick={this.btnCancel}/>
                        
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

export default PenyediaDetail;