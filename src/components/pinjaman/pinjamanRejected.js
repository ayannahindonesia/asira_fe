import React from 'react';
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import './../../support/css/pagination.css'
import {getPermintaanPinjamanFunction} from './saga'
import Moment from 'react-moment'
import 'moment/locale/id';
import { getTokenClient, getTokenAuth } from '../index/token';
import TableComponent from './../subComponent/TableComponent'
import { checkPermission } from '../global/globalFunction';
const columnDataUser = [
  {
      id: 'id',
      numeric: false,
      label: 'ID Pinjaman',
  },
  {
      id: 'borrower_name',
      numeric: false,
      label: 'Nama Nasabah',
  },
  {
      id: 'category',
      numeric: false,
      label: 'Kategori',
  },
    {
      id: 'service',
      numeric: false,
      label: 'Layanan',
    },
    {
    id: 'product',
    numeric: false,
    label: 'Produk',
    },
    {
    id: 'created_at',
    numeric: false,
    label: 'Tanggal Pengajuan',
    },
]
class PinjamanRejected extends React.Component {
  _isMounted = false

  state = {
    rows: [],detailNasabah:{}, searchRows:'',paging:true,
    page: 1,
    rowsPerPage: 10,
    isEdit: false,
    editIndex:Number,
    udahdiklik : false,
    total_data:0,
    last_page:1,
    loading:true,
    errorMessage:''
  };

  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  
  componentDidMount(){
    this._isMounted=true
    this._isMounted && this.getPermintaanPinjamanBtn()
  }
  componentWillUnmount(){
    this._isMounted=false
  }
  UNSAFE_componentWillReceiveProps(newProps){
    this.setState({errorMessage:newProps.error})
  }

  getPermintaanPinjamanBtn = async function () {
    let params={ 
      status:"rejected",
      rows:"10",
      page:this.state.page
    }

    let hasil = this.state.searchRows

    if(hasil){
      params.search_all = hasil
    }

    const data = await getPermintaanPinjamanFunction(params)
    const pinjamanList = (data.loanRequest && data.loanRequest.data) || [];

    for (const key in pinjamanList){
      pinjamanList[key].category = pinjamanList[key].category==="account_executive"?"Account Executive" :pinjamanList[key].category === "agent"?"Agent":"Personal"
      pinjamanList[key].status_string = pinjamanList[key].status ==="approved"?"Diterima": pinjamanList[key].status==="rejected"?"Ditolak":"Dalam Proses"
      pinjamanList[key].service =  pinjamanList[key].service.toString()
      pinjamanList[key].product =  pinjamanList[key].product.toString()
      pinjamanList[key].created_at =<Moment date={pinjamanList[key].created_at } format=" DD  MMMM  YYYY" />
    }

    if(data){
      if(!data.error){
        this._isMounted && this.setState({
          loading:false,
          rows:pinjamanList,
          total_data:(data.loanRequest && data.loanRequest.total_data) || 0,
        })
      }else{
        this._isMounted && this.setState({errorMessage:data.error})
      }
    }
  }

  onBtnSearch = (e)=>{
      this.setState({loading:true,searchRows:e.target.value,page:1},()=>{
        if(this.state.paging){
          this.getPermintaanPinjamanBtn()
        }
      
      })
  }

  onChangePage = (current) => {
    this.setState({loading:true,page:current},
      ()=>{
        if(this.state.paging){
          this.getPermintaanPinjamanBtn()
        }
      
      })
  }

  render() {
   
    if(getTokenClient() && getTokenAuth()){
        
      return (
          <div style={{padding:0}}>
              
          < TableComponent
              title={'Pinjaman Ditolak - List'}
              search={
                {
                  value: this.state.searchRows,
                  label: 'Search ID Nasabah, Nama Nasabah',
                  function: this.onBtnSearch,
                }
              }
              errorMessage={this.state.errorMessage}
              id={"id"}
              paging={this.state.paging}
              loading={this.state.loading}
              columnData={columnDataUser}
              data={this.state.rows}
              page={this.state.page}
              rowsPerPage={this.state.rowsPerPage}
              totalData={this.state.total_data}
              onChangePage={this.onChangePage}             
              permissionDetail={ checkPermission('lender_loan_request_detail') ? '/pinjamanDetail/' : null}
          /> 

          
          </div>
        

      );
    
    

    }
    else if(getTokenAuth()){
      return  <Redirect to='/login' />
    }
      
  }
}

const mapStateToProp = (state)=>{
  return{
     
      role: state.user.role,
      id: state.user.id
     
  }
  
}
export default connect (mapStateToProp)(PinjamanRejected) ;
