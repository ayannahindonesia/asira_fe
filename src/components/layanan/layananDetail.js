import React from 'react'
import { Redirect } from 'react-router-dom'
import { getTokenAuth, getTokenClient } from '../index/token';
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import TitleBar from '../subComponent/TitleBar';
import { getAllLayananDetailFunction } from './saga';
import BrokenLink from './../../support/img/default.png'
import Loader from 'react-loader-spinner';
import CancelIcon from '@material-ui/icons/Cancel';

class LayananDetail extends React.Component{
    _isMounted = false

    state = {
        rows: {},
        diKlik:false,
        loading:true
    };

    componentDidMount(){
        this._isMounted=true
        this._isMounted && this.getLayananDetail()
    }

    componentWillUnmount(){
        this._isMounted=false
    }

    getLayananDetail = async function(){
        const param = {
            id:this.props.match.params.id
        }

        const data = await getAllLayananDetailFunction(param)

        if(data){
            console.log(data)
            if(!data.error){
              this._isMounted && this.setState({
                loading:false,
                rows:data.layananListDetail,
              })
            }else{
              this._isMounted && this.setState({errorMessage:data.error})
            }
          }
    }

    btnCancel =()=>{
        this.setState({diKlik:true})
    }
    render(){
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
        if(this.state.diKlik){
            return(
                <Redirect to='/layanan'/>
            )
        }
        if(getTokenAuth() && getTokenClient()){
            return(
                <Grid container>
                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        <TitleBar
                            title={'Layanan - Detail'}
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
                            ID
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows.id}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Nama Layanan
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows.name}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Deskripsi
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows.description === ''?"-":this.state.rows.description}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Status
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            {this.state.rows.status ==='active'?"Aktif":"Tidak Aktif"}
                            </Grid>

                            <Grid item sm={4} xs={4} style={{padding:'10px'}}>
                            Gambar
                            </Grid>

                            <Grid item sm={8} xs={8} style={{padding:'10px'}}>
                            <img src={`${this.state.rows.image}`} width="100px" height="auto" alt="Foto agen" onError={(e)=>{
                            e.target.attributes.getNamedItem("src").value = BrokenLink
                            }} ></img>  
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

export default LayananDetail