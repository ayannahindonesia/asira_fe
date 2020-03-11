import React from 'react'
import { detailProductFunction, detailServiceProductFunction } from './saga';
import { Redirect } from 'react-router-dom'
import { getTokenClient,getTokenAuth } from '../index/token'
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import { GlobalFunction }  from './../../components/globalFunction'
import TitleBar from '../subComponent/TitleBar';
import Loader from 'react-loader-spinner';
import CancelIcon from '@material-ui/icons/Cancel';

class ProductDetail extends React.Component{
    _isMounted = false;
    state={
       rows:[],
       serviceDetail:[],
       fees:[],
       diklik:false,
       loading:true
    }
    componentWillUnmount() {
        this._isMounted = false;
      }
    componentDidMount (){
        this._isMounted = true;
        this.getAllProductDetail()
    }
    getAllProductDetail = async function () {
        const params ={
           id : this.props.match.params.id
        }
       
        const data = await detailProductFunction (params,detailServiceProductFunction)
        
        if(data){
           const dataProduct = data.dataProduct
           const dataService = data.serviceProduct
         
            if(!data.error){
                this.setState({loading:false,
                    fees:dataProduct.fees,
                    rows:dataProduct,
                    serviceDetail:dataService
                })
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
            if(this.state.paging){
                this.getAllProduct()
            }
        })
    }

    onBtnSearch = (e)=>{
        this.setState({loading : true, page:1,search:e.target.value},()=>{
                this.getAllProduct()
        })
      }
      

    renderFeeJsx = ()=>{
        var jsx = this.state.fees.map((val,index)=>{
            return(
                <Grid container key={index}>
                    <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                        {val.description}
                    </Grid>

                    <Grid item sm={6} xs={6} style={{padding:'10px'}}>
                        {val.amount} - {val.fee_method}
                    </Grid>
                </Grid>
            )

        })
        return jsx
    }

    btnCancel = ()=>{
        this.setState({diklik:true})
    }
    render(){
    if(this.state.diklik){
        return(
            <Redirect to="/produk"/>
        )
    }
    if(this.state.loading){
        return(
            <Loader 
            type="ThreeDots"
            color="#00BFFF"
            height="30"	
            width="30"
            />  
        )
    }
    
    if(getTokenClient()&&getTokenAuth()){
            return(
                <Grid container>
                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        <TitleBar
                            title={'Produk - Detail'}
                        />
                    </Grid>
                    {/* ------------------------------------------- PAPER ----------------------------------------- */}
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                    <Grid item sm={12} xs={12} style={{fontSize:'20px', marginBottom:'10px'}}>
                    <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                        <Tooltip title="Back" style={{outline:'none'}}>
                            <IconButton aria-label="cancel" onClick={this.btnCancel}>
                                <CancelIcon style={{width:'35px',height:'35px'}}/>
                            </IconButton>
                        </Tooltip>       
                    </Grid> 
                        <Grid container>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Nama Produk
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows && this.state.rows.name}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Layanan
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.serviceDetail && this.state.serviceDetail.name}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Bunga
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows.interest} % [{this.state.rows.interest_type}]
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Jangka Waktu (Bulan)
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                              {`${this.state.rows.min_timespan} - ${this.state.rows.max_timespan}`}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Rentang Nilai Pengajuan
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {GlobalFunction.formatMoney (parseInt(this.state.rows.min_loan))} - {GlobalFunction.formatMoney (parseInt(this.state.rows.max_loan))}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Asuransi
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows.assurance}
                            </Grid>

                            {this.renderFeeJsx()}

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Sektor Pembiayaan
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows && this.state.rows.financing_sector && this.state.rows.financing_sector.toString()}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Agunan
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows && this.state.rows.collaterals && this.state.rows.collaterals.toString()}
                            </Grid>
  
                        </Grid>

                        <Grid container style={{marginBottom:'10px', marginTop:'10px', paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                        <Grid item xs={12} sm={12}>
                    

                        </Grid>

                        
                    </Grid>
                    </Grid>
                    </Grid>
                </Grid>
            )
        }
        if(getTokenAuth()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default ProductDetail;