import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getBorrowerFunction, approveRejectFunction } from './saga'
import { getTokenClient } from '../index/token';
import GridDetail from '../subComponent/GridDetail';
import { formatNumber, handleFormatDate, checkPermission, decryptImage } from '../global/globalFunction';
import DialogComponent from './../subComponent/DialogComponent'
import { TextField, Grid, Button } from '@material-ui/core';
import swal from 'sweetalert';
import TitleBar from '../subComponent/TitleBar';
import './../../support/css/profilenasabahdetail.css'


const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

class CalonNasabahDetail extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      dataUser: {},
      calonNasabahId: 0,
      disabled: true,
      loading: true,
      dialog: false,
      title: '',
      message: '',
      rekening: '',
    };

    componentDidMount(){
      this._isMounted = true;

      this.setState({
        calonNasabahId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
      
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    isCategoryExist = (category) => {
      if(category && category.toString().toLowerCase() === 'agent') {
        return 'Agen'
      } else if(category && category.toString().toLowerCase() === 'account_executive') {
        return 'Account Executive'
      } 

      return 'Personal';
    }

    refresh = async function(){
      const param = {};
      param.calonNasabahId = this.state.calonNasabahId;

      const data = await getBorrowerFunction(param);
      

      if(data) {
          if(!data.error) {
            const dataUser = data.dataUser || {};
            let flag = false;

            if(dataUser && dataUser.status && dataUser.status === 'rejected') {
              flag = true
            }

            dataUser.category = this.isCategoryExist(dataUser.category) ;
            dataUser.idcard_image = decryptImage(dataUser.idcard_image);
            dataUser.taxid_image = decryptImage(dataUser.taxid_image)

            if(dataUser && dataUser.bank_accountnumber && dataUser.bank_accountnumber.trim().length !== 0) {
              flag = true
            }
            
            this.setState({
              diKlik: flag,
              dataUser,
              listRole: data.dataRole,
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: data.error,
              loading: false,
            })
          }      
      }
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    UNSAFE_componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    handleDialog = (e) => {
      let label = e.target.value
      let title = '';
      let message='';

      if(label.toLowerCase().includes('ktp')) {
        title = 'KTP'
        message = this.state.dataUser && this.state.dataUser.idcard_image
      } else if(label.toLowerCase().includes('npwp')) {
        title = 'NPWP'
        message = this.state.dataUser && this.state.dataUser.taxid_image
      }

      this.setState({
        dialog: true,
        message,
        title,
      })
    }

    onChangeTextField = (e) => {
      let value = e.target.value;
      let labelName = e.target.id;
      let flag = true;

      if(value.includes(' ') || value.includes('\'') || value.includes('"') || value.includes(',') ) {
        flag = false
      }

      if(labelName === 'rekening' && isNaN(value)) {    
        flag = false 
      }
      
      if(flag) {
        this.setState({
          [labelName]: value,
        })
      } 
    }

    permissionApproval = () => {
      let flag = true;

      if(this.state.dataUser && this.state.dataUser.status && this.state.dataUser.status === 'reject') {
        flag = false;
      }

      if(!checkPermission('lender_prospective_borrower_approval')) {
        flag = false;
      }

      return flag;
    }


    handleClose = () => {
      this.setState({dialog: false})
    }

    btnApproveReject = (e, text) => {
      this.setState({loading: true, errorMessage: ''})
      const textStatus = text ? text : (e.target.value ? e.target.value : '');
      const statusNasabah = textStatus.toString().toLowerCase() === 'terima' ? 'approve' : 'reject'

      if(this.validate(statusNasabah)) {
        this.approveReject(statusNasabah)
      }
    }

    validate = (statusNasabah) => {
      let flag = true;

      if(statusNasabah && statusNasabah === 'approve' && (!this.state.rekening || (this.state.rekening && this.state.rekening.length === 0))) {
        flag = false;
        this.setState({errorMessage: 'Mohon mengisi nomor rekening dengan benar', loading: false})
      }

      return flag;
    }

    approveReject = async function(statusNasabah) {
      const param = {
        id: this.state.dataUser && this.state.dataUser.id,
        account_number: this.state.rekening,
        statusApproval: statusNasabah,
      }

      const data = await approveRejectFunction(param);

      if(data) {
        if(!data.error) {
          let stringCalonNasabah = 'Reject'

          if(statusNasabah === 'approve') {
            stringCalonNasabah = 'Approve'
          }

          swal("Success",`${stringCalonNasabah} Calon Nasabah Berhasil`,"success")

          this.setState({
            loading: false,
            diKlik: true,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listCalonNasabah'/>            
        } else if (this.state.loading){
          return  (
            <div  key="zz">
              <div align="center" colSpan={6}>
                <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
              </div>
            </div>
          )
        } else if(getTokenClient()){
            return(
              <Grid container className="containerDetail">
                <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                    <TitleBar
                        title={'Calon Nasabah - Detail'}
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
                              <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="KTP Detail" onClick={this.handleDialog}></input>                               
                          </Grid>
                          <Grid item sm={2} xs={12} >
                              <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="NPWP Detail" onClick={this.handleDialog}></input>
                          </Grid>
                      </Grid>                        
                    </Grid>


                    <GridDetail
                      gridLabel={[5,6,6]}
                      background
                      noTitleLine
                      label={[
                        ['Id Nasabah','Mitra Nasabah'],
                        ['Kategori','Agen / AE'],
                        ['Tanggal Register'],
                      ]}
                      data={this.state.dataUser && [
                        [
                          this.state.dataUser.id, 
                          this.state.dataUser.bank_name
                        ],
                        [
                          this.state.dataUser.category,
                          this.state.dataUser.agent_name && (`${this.state.dataUser.agent_name} ` + (this.state.dataUser.agent_provider_name && this.state.dataUser.agent_provider_name.trim().length !== 0 ? `(${this.state.dataUser.agent_provider_name})` : '')),
                        ],
                        [
                          this.state.dataUser.created_at && handleFormatDate(this.state.dataUser.created_at)
                        ],
                      ]}                 
                    />

                    <GridDetail
                      title="Informasi Pribadi"
                      gridLabel={[5,6,6]}
                      label={[
                        ['Nama','Jenis Kelamin','No KTP','No NPWP','Email'],
                        ['Tanggal Lahir','Tempat Lahir','Pendidikan','Nama Ibu Kandung','No HP'],
                        ['Status Pernikahan','Nama Pasangan','Tanggal Lahir Pasangan','Pendidikan Pasangan','Tanggungan (orang)'],
                      ]}
                      data={this.state.dataUser && [
                        [
                          this.state.dataUser.fullname, 
                          this.state.dataUser.gender && (this.state.dataUser.gender === 'M' ? 'Pria' : 'Perempuan'),
                          this.state.dataUser.idcard_number,
                          this.state.dataUser.taxid_number,
                          this.state.dataUser.email
                        ],
                        [
                          this.state.dataUser.birthday && new Date(this.state.dataUser.birthday).getFullYear() !== 1 ? handleFormatDate(this.state.dataUser.birthday) : '-',
                          this.state.dataUser.birthplace,
                          this.state.dataUser.last_education,
                          this.state.dataUser.mother_name,
                          this.state.dataUser.phone
                        ],
                        [

                          this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? 'Menikah' : 'Belum Menikah',
                          this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? this.state.dataUser.spouse_name : '-',
                          this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? ((this.state.dataUser.spouse_birthday && handleFormatDate(this.state.dataUser.spouse_birthday)) || '-') : '-',
                          this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? this.state.dataUser.spouse_lasteducation : '-',
                          this.state.dataUser.dependants > 5?"Lebih dari 5":this.state.dataUser.dependants
                        ],
                      ]}                 
                    />

                    <GridDetail
                      title="Data Tempat Tinggal"
                      gridLabel={[5,6]}
                      label={[
                        ['Alamat','Provinsi','Kota','RT / RW','No Telp Rumah'],
                        ['Kecamatan','Kelurahan','Status Tempat Tinggal','Lama Menempati Rumah'],
                        [],
                      ]}
                      data={this.state.dataUser && [
                        [
                          this.state.dataUser.address, 
                          this.state.dataUser.province,
                          this.state.dataUser.city,
                          `${this.state.dataUser.neighbour_association} / ${this.state.dataUser.hamlets} `,
                          this.state.dataUser.home_phonenumber
                        ],
                        [
                          this.state.dataUser.subdistrict,
                          this.state.dataUser.urban_village,
                          this.state.dataUser.home_ownership,
                          this.state.dataUser.lived_for && `${this.state.dataUser.lived_for} tahun`,
                        ],
                        [],
                      ]}                 
                    />

                    <GridDetail
                      title="Info Pekerjaan"
                      gridLabel={[5,6,6]}
                      label={[
                        ['Jenis Pekerjaan','No Induk Pegawai','Nama Instansi','Alamat Kantor'],
                        ['Jabatan','Lama Bekerja','Nama Atasan','No Tlp Kantor'],
                        ['Gaji (perbulan)','Pendapatan Lain','Sumber Pendapatan Lain'],
                      ]}
                      data={this.state.dataUser && [
                        [
                          this.state.dataUser.field_of_work, 
                          this.state.dataUser.employee_id,
                          this.state.dataUser.employer_name,
                          this.state.dataUser.employer_address
                        ],
                        [
                          this.state.dataUser.occupation,
                          this.state.dataUser.been_workingfor && `${this.state.dataUser.been_workingfor} tahun`,
                          this.state.dataUser.direct_superiorname,
                          this.state.dataUser.employer_number,
                        ],
                        [
                          this.state.dataUser.monthly_income && `Rp ${formatNumber(this.state.dataUser.monthly_income,true)}`,
                          this.state.dataUser.other_income && `Rp ${formatNumber(this.state.dataUser.other_income,true)}`,
                          this.state.dataUser.other_incomesource,
                        ],
                      ]}                 
                    />

                    <GridDetail
                      title="Lain lain"
                      gridLabel={[8]}
                      label={[
                        ['Nama Orang Tidak Serumah Yang Bisa Dihubungi','Hubungan','Alamat Rumah','No Tlp','No HP'],
                        []
                      ]}
                      data={this.state.dataUser && [
                        [
                          this.state.dataUser.related_personname, 
                          this.state.dataUser.related_relation, 
                          this.state.dataUser.related_address,
                          this.state.dataUser.related_homenumber,
                          this.state.dataUser.related_phonenumber
                        ],
                        []
                      ]}                 
                    />

                    <Grid container style={{paddingLeft:'10px', marginBottom:'10px', border:"0.5px solid #75A9D1",paddingTop:"10px",paddingBottom:"10px"}}>
                      <Grid item sm={3} xs={3}>
                        Nomor Rekening
                      </Grid>

                      <Grid item sm={3} xs={3}>
                        <TextField
                          id="rekening"
                          onChange={this.onChangeTextField}
                          value={this.state.rekening}
                          hiddenLabel
                          fullWidth
                          style={{fontSize:'calc(10px + 0.3vw)', border:'1px groove', paddingLeft:'5px'}}
                        />
                      </Grid>
                    </Grid>


                    <div className="col-sm-12">
                      <DialogComponent
                        title={this.state.title}
                        openDialog={this.state.dialog}
                        message={this.state.message}
                        type='image'
                        onClose={this.handleClose}
                      />
                    </div>

                        
                    <Grid container style={{marginBottom:'10px', marginTop:'10px', paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                        <Grid item xs={12} sm={12}>
                            {
                                this.permissionApproval() &&
                                <Button disableElevation
                                  variant='contained'
                                  style={{marginRight:'10px',padding: '2px', width:'100px',backgroundColor:'rgb(32, 184, 137)', color:'white'}}
                                  onClick={(e) => this.btnApproveReject(e, 'terima')}
                                >
                                  <b>Terima</b>
                                </Button>
                            }

                            {
                                this.permissionApproval() &&
                                <Button disableElevation
                                  variant='contained'
                                  style={{marginRight:'10px',padding: '2px', width:'100px',backgroundColor:'rgb(238, 105, 105)', color:'white'}}
                                  onClick={(e) => this.btnApproveReject(e, 'tolak')}
                                >
                                  <b>Tolak</b>
                                </Button>
                            }

                            
                            <Button disableElevation
                                variant='contained'
                                style={{padding: '2px', width:'100px',backgroundColor:'#2076B8', color:'white'}}
                                onClick={this.btnCancel}
                            >
                                <b>Kembali</b>
                            </Button>
                            
                            
                        </Grid>

                        
                    </Grid>
                    
                    
                 </Grid>
                </Grid>
              </Grid>
            )
        } else if(!getTokenClient()){
          return (
              <Redirect to='/login' />
          )    
        }
       
    }
}

export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
  // menu: getMenu(),
  // fetching: getFetchStatus(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(CalonNasabahDetail);