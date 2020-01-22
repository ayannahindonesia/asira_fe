import React from 'react'
import { Redirect } from 'react-router-dom'
import {TujuanDetailFunction} from './saga'
import { getToken } from '../index/token';

class TujuanDetail extends React.Component{
    _isMounted = false
    state = {rows:{}}
    componentDidMount(){
        this._isMounted = true;
        this.getTypeBankDetail()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getTypeBankDetail = async function () {
        var id = this.props.match.params.id
        
        const param = {
            id,
        }

        const data = await TujuanDetailFunction(param)

        if(data){
            if(!data.error){
                this.setState({rows:data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    render(){
        if(getToken()){
            return(
                <div className="container">
                   <h2>Tujuan Pembiayaan - Detail</h2>
                   <hr/>
                   
                   <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">ID Tujuan Pembiayaan</label>
                            <div className="col-sm-8">
                            : {this.state.rows.id}

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Tujuan Pembiayaan</label>
                            <div className="col-sm-8">
                            : {this.state.rows.name}
                            

                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-8">
                            : {this.state.rows.status==="active"?"Aktif":"Tidak Aktif"}
                        
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">
                                <input type="button" className="btn btn btn-secondary" value="Kembali" onClick={()=>  window.history.back()}/>
                            </label>
                            <div className="col-sm-8">

                            </div>
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

export default TujuanDetail;