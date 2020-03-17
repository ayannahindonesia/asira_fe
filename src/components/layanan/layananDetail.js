import React from 'react'
import './../../support/css/layananAdd.css'
import { Redirect } from 'react-router-dom'
import { getAllLayananDetailFunction } from './saga';
import { getTokenClient } from '../index/token';
import Loading from '../subComponent/Loading';
import { Grid, IconButton, Tooltip, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import TitleBar from '../subComponent/TitleBar';
import CancelIcon from '@material-ui/icons/Cancel';
import { changeFileToBase64 } from '../global/globalFunction';
import UploadFile from '../subComponent/UploadFile';
import ActionComponent from '../subComponent/ActionComponent';

class LayananDetail extends React.Component{
    _isMounted = false;

    state={
        selectedFile:null,
        file: null,
        namaLayanan: '',
        status: true,
        description: '',
        errorMessage:'',
        diKlik:false,
        modifyType: false,
        loading:true
    }
    componentDidMount(){
        this._isMounted=true
        this.getDetailLayanan()
    }
    componentWillUnmount(){
        this._isMounted=false
    }

    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    getDetailLayanan = async function () {
        const id = this.props.match.params.id
        const data = await getAllLayananDetailFunction({id});

        if(data){
            if(!data.error){
                const dataLayanan = data.layananListDetail || {};

                this.setState({
                    id: dataLayanan.id,
                    namaLayanan: dataLayanan.name,
                    description: dataLayanan.description,
                    selectedFile: dataLayanan.image,
                    status: dataLayanan.status === 'active' ? true : false,
                    loading: false,
                })

            }else{
                this.setState({errorMessage:data.error, loading: false})
            }
        }
    }
    
    onChangeHandler = (event)=>{
        let input = event.target;

        this.formatImage(input.files[0])
        
    }

    formatImage = async function(file) {
        let data = file && await changeFileToBase64(file);

        if(data) {
            if(!data.error) {
                this.setState({selectedFile:data, file})
            } else {
                this.setState({errorMessage:data.error})
            }
        }
    }
    
    validate = () => {
        let flag = true;
        
        if(this.state.namaLayanan.trim().length === 0){
            flag = false;
            this.setState({errorMessage:"Nama Layanan tidak boleh kosong",loading:false})
        } else if(this.state.description.length > 250){
            flag = false;
            this.setState({errorMessage:"Deskripsi layanan panjang maksimal 250 karakter",loading:false})
        } else if(!this.state.selectedFile || this.state.selectedFile.toString().trim().length === 0){
            flag = false;
            this.setState({errorMessage:" Gambar tidak boleh kosong",loading:false})
        } else if(this.state.file && this.state.file.size > 1000000){
            flag = false;
            this.setState({errorMessage:"Gambar tidak boleh lebih dari 1 MB - Harap Cek ulang",loading:false})
        } 

        return flag
    }

    onChangeTextField = (e, labelData, number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }

        this.setState({[labelData]:dataText})
    }

    removeImage = (e,labelData) => {
        this.setState({[labelData]: null})
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    handleChecked = (e, labelData)=>{
        this.setState({[labelData]:!this.state[labelData]})
    }

    btnEditLayanan = () => {
        this.setState({modifyType: true})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/layanan'/>            

        } else if(this.state.loading) {
            return(
                <Loading
                    title={this.state.modifyType ? 'Layanan - Ubah':'Layanan - Detail'}
                />
            )
            
             
        } else if(getTokenClient()){
            return(
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={this.state.modifyType ? 'Layanan - Ubah':'Layanan - Detail'}
                        />

                    </Grid>
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                        <Grid container>
                            {/* Action Button */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red', display:'flex', justifyContent:'flex-end'}}>
                                <ActionComponent
                                    onCancel={this.btnCancel}
                                />
                            </Grid>

                            {/* Error */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                {this.state.errorMessage}
                            </Grid>
                            {/* Nama Layanan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'20px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Nama Layanan
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="namaLayanan"
                                            value={this.state.namaLayanan}
                                            onChange={(e) => this.onChangeTextField(e,'namaLayanan')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            disabled={!this.state.modifyType}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Deskripsi Layanan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'25px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Deskripsi
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="description"
                                            value={this.state.description}
                                            onChange={(e) => this.onChangeTextField(e,'description')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            disabled={!this.state.modifyType}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Gambar Layanan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'30px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Gambar
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <UploadFile
                                            file={this.state.selectedFile}
                                            onChange={this.onChangeHandler}
                                            disabled={!this.state.modifyType}
                                        />
                                    </Grid>
                                    {
                                        this.state.selectedFile && this.state.modifyType &&
                                        <Grid item xs={1} sm={1} style={{paddingTop:'20px'}}>
                                            <Tooltip title="Remove" style={{outline:'none'}}>
                                                <IconButton aria-label="cancel" onClick={(e) => this.removeImage(e,'selectedFile')} >
                                                    <CancelIcon style={{width:'35px',height:'35px'}} />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    }
                                    
                                    

                                    
                                    
                                </Grid>
                            </Grid>

                            {/* Status */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'25px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'10px'}}>
                                        Status
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.status}
                                                    onChange={(e) => this.handleChecked(e, 'status')}
                                                    color={this.state.status ? "primary":"default"}
                                                    value="default"
                                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                                    disabled={!this.state.modifyType}
                                                />
                                            }
                                            label={'Aktif'}
                                        />
                                        
                                    </Grid>
                                </Grid>
                            </Grid>      


                        </Grid>
                    </Grid>
                </Grid>
                
            )
        }
        if(!getTokenClient()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default LayananDetail;