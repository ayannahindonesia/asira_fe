import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getBorrowerFunction, getImageFunction } from './saga'
import { getToken } from '../index/token';
import GridDetail from '../subComponent/GridDetail';
import { formatNumber, handleFormatDate, decryptImage } from '../global/globalFunction';
import DialogComponent from '../subComponent/DialogComponent'

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

class CalonNasabahArsipDetail extends React.Component{
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

            if(dataUser && dataUser.status && dataUser.status !== 'rejected') {
              flag = true;
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

    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    handleDialog = (e) => {
      let label = e.target.value
      let title = '';

      if(label.toLowerCase().includes('ktp')) {
        title = 'KTP'
      } else if(label.toLowerCase().includes('npwp')) {
        title = 'NPWP'
      }

      this.setState({
        title,
      }, () => {
        this.getImage(this.state.title)
      })
    }

    getImage = async function(title) {
      let data = {
        idImage: 0,
      };

      if(title.toLowerCase().includes('ktp')) {
        data.idImage = (this.state.dataUser && this.state.dataUser.idcard_image ) || 0
      } else if(title.toLowerCase().includes('npwp')) {
        data.idImage = (this.state.dataUser && this.state.dataUser.taxid_image ) || 0
      }

      data = await getImageFunction(data)

      if(data) {
        if(!data.error) {
          let message = data.image && data.image.image_string;

          this.setState({
            dialog:true,
            message,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }


    handleClose = () => {
      this.setState({dialog: false})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listCalonNasabahArsip'/>            
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
        } else if(getToken()){
            return(
              <div className="container mt-4">
                <h3> Calon Nasabah Arsip  - Detail</h3>
                
                <hr/>
                 
                <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left', marginBottom:'10px'}}>
                  {this.state.errorMessage}
                </div>   

                <div className="col-sm-12" style={{marginBottom:'10px'}}>
                  <input type="button" value="KTP Detail" className="btn" onClick={this.handleDialog} style={{width:'120px',backgroundColor:"blue",color:"white",marginRight:'10px'}}/>
                  <input type="button" value="NPWP Detail" className="btn" onClick={this.handleDialog} style={{width:'120px',backgroundColor:"blue",color:"white"}}/>               
                </div>

                <GridDetail
                  gridLabel={[4,3,5]}
                  background
                  label={[
                    ['Id Nasabah','Bank Nasabah'],
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
                  gridLabel={[4,5,7]}
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
                      this.state.dataUser.birthday && handleFormatDate(this.state.dataUser.birthday),
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
                      this.state.dataUser.dependants
                    ],
                  ]}                 
                />

                <GridDetail
                  title="Data Tempat Tinggal"
                  gridLabel={[4,5,7]}
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
                  gridLabel={[4,5,7]}
                  label={[
                    ['Jenis Pekerjaan','No Induk Pegawai','Nama Instansi','Alamat Kantor'],
                    ['Jabatan','Lama Bekerja','Nama Atasan','No Tlp Kantor'],
                    ['Gaji (perbulan)','Pendapatan Lain','Sumber Pendapatan Lain',],
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
                  gridLabel={[7]}
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


                <div className="col-sm-12">
                  <DialogComponent
                    title={this.state.title}
                    openDialog={this.state.dialog}
                    message={this.state.message}
                    type='image'
                    onClose={this.handleClose}
                  />
                </div>

                    
                <div className="col-sm-12">
                  <input type="button" value="Kembali" className="btn" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                </div>
                    
                    
                 
                
              </div>
            )
        } else if(!getToken()){
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
  )(CalonNasabahArsipDetail);