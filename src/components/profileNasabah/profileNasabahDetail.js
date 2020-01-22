import React from 'react'
import './../../support/css/profilenasabahdetail.css'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getProfileNasabahDetailFunction } from './saga';
import { getProfileUser,getTokenClient,getTokenAuth } from '../index/token'
import BrokenLink from './../../support/img/default.png'
import GridDetail from './../subComponent/GridDetail'
import { handleFormatDate, decryptImage } from '../global/globalFunction';
import Grid from '@material-ui/core/Grid';
import TitleBar from '../subComponent/TitleBar';


class profileNasabahDetail extends React.Component{
    _isMounted = false
    state={bankName:'',rows:[],modalKTP:false,modalNPWP:false,npwp:null,ktp:null,gambarKTP:null,gambarNPWP:null}
    
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
                data.detailProfileNasabah.idcard_image = decryptImage(data.detailProfileNasabah.idcard_image);
                data.detailProfileNasabah.taxid_image = decryptImage(data.detailProfileNasabah.taxid_image)

                this._isMounted && this.setState({rows:data.detailProfileNasabah,ktp:data.detailProfileNasabah.idcard_image.Int64,npwp:data.detailProfileNasabah.taxid_image.Int64})

             }else{
                this._isMounted && this.setState({errorMessage:data.error})
             }
         }  
    }

    btnModalKTP =()=>{
        this.setState({modalKTP:true})
    }
    btnModalNPWP =()=>{
        this.setState({modalNPWP:true})
    
    }
    btnModalCancelKTP=()=>{
        this.setState({modalKTP:false})
    }
    btnModalCancelNPWP=()=>{
        this.setState({modalNPWP:false})
    }
  
    render(){
        if(getTokenAuth() && getTokenClient()){
            return(
                <Grid container className="containerDetail">
                    {/* ------------------------------------------------------FOTO KTP------------------------------------------------------ */}

                    <Modal isOpen={this.state.modalKTP} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>KTP Detail</ModalHeader>
                        <ModalBody>
                            {this.state.ktp ===0 || this.state.gambarKTP === '' ?"Gambar KTP Tidak ada":
                            <img width="100%" height="300px" alt="KTP" onError={(e)=>{
                            e.target.attributes.getNamedItem("src").value = BrokenLink
                            }} src={`${this.state.rows.idcard_image}`}></img>
                        }
                        </ModalBody>
                        <ModalFooter>
                        <Button disableElevation color="secondary" onClick={this.btnModalCancelKTP}><b>Close</b></Button>
                        </ModalFooter>
                    </Modal>


                    {/* ------------------------------------------------------FOTO NPWP------------------------------------------------------ */}

                    <Modal isOpen={this.state.modalNPWP} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>NPWP Detail</ModalHeader>
                        <ModalBody>
                            {this.state.npwp ===0 || this.state.gambarNPWP === '' ?"Gambar NPWP Tidak ada":
                            <img width="100%" height="300px" alt="NPWP" onError={(e)=>{
                                e.target.attributes.getNamedItem("src").value = BrokenLink
                            }} src={`${this.state.rows.taxid_image}`}></img>}
                        </ModalBody>
                        <ModalFooter>
                            <Button disableElevation color="secondary" onClick={this.btnModalCancelNPWP}><b>Close</b></Button>
                        </ModalFooter>
                    </Modal>
                      
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
                                <Grid container spacing={2}>
                                    <Grid item sm={2} xs={12} style={{marginBottom:'10px'}}>
                                        <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="KTP Detail" onClick={this.btnModalKTP}></input>                               
                                    </Grid>
                                    <Grid item sm={2} xs={12} >
                                        <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="NPWP Detail" onClick={this.btnModalNPWP}></input>
                                    </Grid>
                                </Grid>                        
                            </Grid>

                            {/* =========================================FIRST================================ */}
                    
                            <GridDetail
                                gridLabel={[5,6,6]}
                                background
                                noTitleLine
                                label={[
                                    ['Id Nasabah','Bank Nasabah','Kategori Pinjaman'],
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

                            <Button disableElevation
                                variant='contained'
                                style={{fontSize:'calc(10px + 0.3vw)', marginLeft: '10px', padding: '2px', width:'100px',backgroundColor:'#2076B8', color:'white', marginBottom:'2vh'}}
                                onClick={()=> window.history.back()}
                            >
                                <b>KEMBALI</b>
                            </Button>


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