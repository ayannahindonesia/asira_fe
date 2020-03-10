import React from 'react'
import './../../support/css/profilenasabahdetail.css'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { Button } from 'reactstrap';
import { getProfileNasabahDetailFunction } from './saga';
import { getProfileUser,getTokenClient,getTokenAuth } from '../index/token'
import GridDetail from './../subComponent/GridDetail'
import { handleFormatDate, decryptImage } from '../global/globalFunction';
import TitleBar from '../subComponent/TitleBar';
import DialogComponent from './../subComponent/DialogComponent'

import { Grid, IconButton, Tooltip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

class profileNasabahDetail extends React.Component{
    _isMounted = false
    state={bankName:'',
    title:'',message:'',diKlik:false,
    rows:[],modalKTP:false,modalNPWP:false,npwp:null,ktp:null,gambarKTP:null,gambarNPWP:null}
    
    componentDidMount(){
        this._isMounted=true
        this._isMounted && this.getDataDetail()  
        if(getProfileUser()) {
            const bank = JSON.parse(getProfileUser()) ;
            this._isMounted && this.setState({bankName: bank.name})
          }
    }
    componentWillUnmount(){
        this._isMounted=false
    }
    formatMoney=(number)=>
    { return number.toLocaleString('in-RP', {style : 'currency', currency: 'IDR'})}

    getDataDetail = async function (){
         const param = {id:this.props.match.params.id}
         const data = await getProfileNasabahDetailFunction(param)
         
         if(data){
             if(!data.error){   
                let flag = false
                data.detailProfileNasabah.idcard_image = decryptImage(data.detailProfileNasabah.idcard_image);
                data.detailProfileNasabah.taxid_image = decryptImage(data.detailProfileNasabah.taxid_image)
                data.detailProfileNasabah.image = decryptImage(data.detailProfileNasabah.image)


                this._isMounted && this.setState({rows:data.detailProfileNasabah,diKlik:flag})

             }else{
                this._isMounted && this.setState({errorMessage:data.error})
             }
         }  
    }

    handleDialog = (e) => {
        let label = e.target.value
        let title = '';
        let message='';
  
        if(label.toLowerCase().includes('ktp')) {
          title = 'KTP'
          message = this.state.rows && this.state.rows.idcard_image
  
        } else if(label.toLowerCase().includes('npwp')) {
          title = 'NPWP'
          message = this.state.rows && this.state.rows.taxid_image
  
        }
        else if(label.toLowerCase().includes('profile')) {
          title = 'Foto Profile'
          message = this.state.rows && this.state.rows.image
        }
  
        this.setState({
          dialog: true,
          message,
          title,
        })
      }

      handleClose = () => {
        this.setState({dialog: false})
      }
  
    render(){
        if(this.state.diKlik){
            return(
                <Redirect to='/profileNasabah'/>
            )
        }
        if(getTokenAuth() && getTokenClient()){
            return(
                <Grid container className="containerDetail">
                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        <TitleBar
                            title={'Nasabah - Detail'}
                        />

                    </Grid>
    
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:10, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                        <Grid container>
                            <Grid item sm={12} xs={12} style={{color:'red'}}>
                                {this.state.errorMessage}
                            </Grid>

                            <Grid item sm={12} xs={12} style={{marginBottom:"10px"}}>
                                <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                                    <Tooltip title="Back" style={{outline:'none'}}>
                                        <IconButton aria-label="cancel" onClick={()=> this.setState({diKlik:true})}>
                                            <CancelIcon style={{width:'35px',height:'35px'}}/>
                                        </IconButton>
                                    </Tooltip>       
                                </Grid> 
                                <Grid container spacing={2}>
                                    <Grid item sm={2} xs={12} style={{marginBottom:'10px'}}>
                                        <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="Foto KTP" onClick={this.handleDialog}></input>                               
                                    </Grid>
                                    <Grid item sm={2} xs={12} style={{marginBottom:'10px'}}>
                                        <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="Foto NPWP" onClick={this.handleDialog}></input>
                                    </Grid>
                                    <Grid item sm={2} xs={12} >
                                        <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="Foto Profile" onClick={this.handleDialog}></input>
                                    </Grid>
                                   
                                </Grid> 
                                              
                            </Grid>

                            {/* =========================================FIRST================================ */}
                    
                            <GridDetail
                                gridLabel={[5,6,6]}
                                background
                                noTitleLine
                                label={[
                                    ['Id Nasabah','Mitra Nasabah','Kategori Pinjaman'],
                                    ['Rekening Pinjaman','Pinjaman Ke','Agen / AE'],
                                    ['Status Nasabah','Tanggal Register'],
                                ]}
                                data={this.state.rows && [
                                    [
                                        this.state.rows.id, 
                                        this.state.rows.bank_name,
                                        this.state.rows.category ==="account_executive"?"Account Executive" :
                                        this.state.rows.category === "agent"?"Agent":"Personal"
                                    ],
                                    [
                                        this.state.rows.bank_accountnumber,
                                        this.state.rows.loan_count,
                                        this.state.rows.agent_name ===""?"-":this.state.rows.agent_name
                                    ],
                                    [
                                        this.state.rows.loan_status==="inactive"?"Tidak Aktif":"Aktif",
                                        this.state.rows.created_at && handleFormatDate(this.state.rows.created_at)
                                    ],
                                ]}                 
                            />

                            {/* ==============================SECOND===================================== */}
                            <GridDetail
                                title="Informasi Pribadi"
                                gridLabel={[5,6,6]}
                                label={[
                                    ['Nama','Jenis Kelamin','No KTP','No NPWP','Email'],
                                    ['Tanggal Lahir','Tempat Lahir','Pendidikan','Nama Ibu Kandung','No HP'],
                                    ['Status Pernikahan','Nama Pasangan','Tanggal Lahir Pasangan','Pendidikan Pasangan','Tanggungan (Orang)'],
                                
                                ]}
                                data={this.state.rows && [
                                    [
                                        this.state.rows.fullname, 
                                        this.state.rows.gender && (this.state.rows.gender === 'M' ? 'Pria' : 'Perempuan'),
                                        this.state.rows.idcard_number,
                                        this.state.rows.taxid_number,
                                        this.state.rows.email
                                    ],
                                    [
                                    this.state.rows.birthday && handleFormatDate(this.state.rows.birthday),
                                    this.state.rows.birthplace,
                                    this.state.rows.last_education,
                                    this.state.rows.mother_name,
                                    this.state.rows.phone
                                    ],
                                    [
                                        this.state.rows.marriage_status && this.state.rows.marriage_status === 'Menikah' ? 'Menikah' : 'Belum Menikah',
                                        this.state.rows.marriage_status && this.state.rows.marriage_status === 'Menikah' ? this.state.rows.spouse_name : '-',
                                        this.state.rows.marriage_status && this.state.rows.marriage_status === 'Menikah' ? ((this.state.rows.spouse_birthday && handleFormatDate(this.state.rows.spouse_birthday)) || '-') : '-',
                                        this.state.rows.marriage_status && this.state.rows.marriage_status === 'Menikah' ? this.state.rows.spouse_lasteducation : '-',
                                        this.state.rows.dependants >5 ?"Lebih dari 5":this.state.rows.dependants 
                                    ]
                                ]}                 
                            />

                            {/* ==============================THIRD===================================== */}

                            <GridDetail
                                title="Data Tempat Tinggal"
                                gridLabel={[5,6]}
                                label={[
                                    ['Alamat','Provinsi','Kota','RT/ RW','No Telp Rumah'],
                                    ['Kecamatan','Kelurahan','Status Tempat Tinggal','Lama Menempati Rumah'],
                                ]}
                                data={this.state.rows && [
                                    [
                                    this.state.rows.address, 
                                    this.state.rows.province,
                                    this.state.rows.city,
                                    this.state.rows.neighbour_association +" / "+ this.state.rows.hamlets ,
                                    this.state.rows.home_phonenumber
                                    ],
                                    [
                                    this.state.rows.subdistrict,
                                    this.state.rows.urban_village,
                                    this.state.rows.home_ownership,
                                    this.state.rows.lived_for +" Tahun"
                                    ],[]
                                ]}                 
                            />

                            {/* ==============================FOURTH===================================== */}
                            <GridDetail
                                title="Info Pekerjaan"
                                gridLabel={[5,6,6]}
                                label={[
                                    ['Jenis Pekerjaan','No Induk Pegawai','Nama Instansi','Alamat Kantor'],
                                    ['Jabatan','Lama Bekerja','Nama Atasan','No Tlp Kantor'],
                                    ['Gaji (Perbulan)','Pendapatan Lain','Sumber Pendapatan Lain']
                                ]}
                                data={this.state.rows && [
                                    [
                                    this.state.rows.occupation, 
                                    this.state.rows.employee_id,
                                    this.state.rows.employer_name,
                                    this.state.rows.employer_address
                                    ],
                                    [
                                    this.state.rows.department,
                                    this.state.rows.been_workingfor +' Tahun',
                                    this.state.rows.direct_superiorname,
                                    this.state.rows.employer_number 
                                    ],
                                    [
                                        this.state.rows.monthly_income ? this.formatMoney(parseInt(this.state.rows.monthly_income)):0,
                                        this.state.rows.other_income ? this.formatMoney(parseInt(this.state.rows.other_income)):0,
                                        this.state.rows.other_incomesource,
                                    ]
                                ]}                 
                            />
                    
                            {/* ==============================FIFTH===================================== */}
                            <GridDetail
                                title="Lain lain"
                                gridLabel={[8]}
                                label={[
                                    ['Nama Orang Tidak Serumah Yang Bisa Dihubungi','Hubungan','Alamat Rumah','No Tlp','No HP'],
                                    []
                                ]}
                                data={this.state.rows && [
                                    [
                                    this.state.rows.related_personname, 
                                    this.state.rows.related_relation, 
                                    this.state.rows.related_address,
                                    this.state.rows.related_homenumber,
                                    this.state.rows.related_phonenumber
                                    ],
                                    []
                                ]}                 
                            />

                          
                            <div className="col-sm-12">
                                <DialogComponent
                                    title={this.state.title}
                                    openDialog={this.state.dialog}
                                    message={this.state.message}
                                    type='image'
                                    onClose={this.handleClose}
                                />
                            </div>

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
const mapStateToProp = (state)=>{
    return{
        name:state.user.name
        
    }
    
  }
export default connect(mapStateToProp) (profileNasabahDetail);