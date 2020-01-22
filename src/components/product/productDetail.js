import React from 'react'
import { Redirect } from 'react-router-dom'
import NumberFormat from 'react-number-format';
import { detailProductFunction, detailServiceProductFunction } from './saga';
import { getToken } from '../index/token';
import Loader from 'react-loader-spinner'

class ProductDetail extends React.Component{
    state = {rows:[],fees:[],collaterals:[],financing_sector:[],layanan:"",loading:true,errorMessage:null}
    _isMounted = false
    componentDidMount(){
        this.getDetailProduct()
        this._isMounted = true
    }
    componentWillUnmount(){
        this._isMounted = false
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    getDetailProduct = async function () {
        var id = this.props.match.params.id
        const data  = await detailProductFunction({id},detailServiceProductFunction)

        if(data){
            console.log(data)
            if(!data.error){
                this.setState({loading:false,layanan:data.serviceProduct.name,rows:data.dataProduct,fees:data.dataProduct.fees,collaterals:data.dataProduct.collaterals,financing_sector:data.dataProduct.financing_sector})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
  
    renderAdminFee = ()=>{
      
        var jsx = this.state.fees.map((val,index)=>{
            return(
                <div className="form-group row" key={index}>
                            <label className="col-sm-4 col-form-label">{val.description} </label>
                            <div className="col-sm-8">
                            : {val.amount ===" %" ?"-":val.amount} 
                            </div>
                        </div>
            )
        })
        return jsx
    }
    render(){
        if (this.state.loading){
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
        }else{

        
        if(getToken()){
            return(
                <div className="container">
                     <div className="form-group row">
                                        <div style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                                {this.state.errorMessage}
                                        </div>
                                            
                    </div>
                   <h2>Produk - Detail</h2>
                    <hr></hr>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Nama Produk</label>
                            <div className="col-sm-8">
                            : {this.state.rows.name}

                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Jangka Waktu (Bulan)</label>
                            <div className="col-sm-8">
                            : {this.state.rows.min_timespan} s/d {this.state.rows.max_timespan}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Imbal Hasil</label>
                            <div className="col-sm-8">
                            : {this.state.rows.interest}%
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Rentang Pengajuan</label>
                            <div className="col-sm-8">
                            : <NumberFormat thousandSeparator={true} thousandsGroupStyle="Rupiah" prefix={'Rp.'} displayType={'text'} value={this.state.rows.min_loan}/> s/d  <NumberFormat thousandSeparator={true} displayType={'text'} thousandsGroupStyle="Rupiah" prefix={'Rp.'} value={this.state.rows.max_loan}/>
                            </div>
                        </div>
                    </form>
                   
                        {this.state.fees.length === 0 ? 
                            
                            <form>
                                <div className="form-group row">
                                    <label className="col-sm-4 col-form-label">Admin Fee</label>
                                    <div className="col-sm-8">
                                    : -
                                    </div>
                                </div>
                            </form>
                            : this.renderAdminFee()}
                   
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Layanan</label>
                            <div className="col-sm-8">
                            : {this.state.layanan}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Agunan</label>
                            <div className="col-sm-8">
                            : {this.state.collaterals === undefined ?  "-" :this.state.collaterals.toString()}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Sektor Pembiayaan</label>
                            <div className="col-sm-8">
                            : {this.state.financing_sector === undefined?"-":this.state.financing_sector.toString()}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Asuransi</label>
                            <div className="col-sm-8">
                            : {this.state.rows.assurance==="null"?"-":this.state.rows.assurance}
                            </div>
                        </div>
                    </form>
                    <form>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Status</label>
                            <div className="col-sm-8">
                            : {this.state.rows.status ==="active"?"Aktif":"Tidak Aktif"}
                            </div>
                        </div>
                    </form>

                    <div className="form-group row">
                            <label className="col-sm-4 col-form-label">
                                <input type="button" className="btn btn btn-secondary" value="Kembali" onClick={()=>  window.history.back()}/>
                            </label>
                            <div className="col-sm-8">

                            </div>
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
}

export default ProductDetail;