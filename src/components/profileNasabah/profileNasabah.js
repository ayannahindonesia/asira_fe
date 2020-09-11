import React from 'react';
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import './../../support/css/pagination.css'
import {getAllProfileNasabahFunction} from './saga'
import 'moment/locale/id';
import { getTokenClient,getTokenAuth } from '../index/token'
import TableComponent from './../subComponent/TableComponent'
import { checkPermission } from '../global/globalFunction';

const columnDataUser = [
  {
      id: 'id',
      numeric: false,
      label: 'ID Nasabah',
  },
  {
      id: 'fullname',
      numeric: false,
      label: 'Nama Nasabah',
  },
  {
      id: 'category',
      numeric: false,
      label: 'Kategori',
  },
  {
    id: 'created_at',
    numeric: false,
    type: 'datetime',
    label: 'Tanggal Registrasi',
  },
  {
    id: 'loan_status',
    numeric: false,
    label: 'Status Pinjaman Nasabah',
  },
]

class profileNasabah extends React.Component {
  
  _isMounted = false
  state = {
    rows: [], 
    searchRows:'',
    paging:true,
    page: 1,
    rowsPerPage: 10,
    isEdit: false,
    total_data:0,
    last_page:1,
    loading:true,
  };
  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  componentDidMount(){
    this._isMounted=true
    this._isMounted && this.getProfileNasabah()
  }
  componentWillUnmount(){
    this._isMounted=false
  }

  
  //Ambil data pertama kali
  getProfileNasabah = async function(){
    const param ={
      rows:this.state.rowsPerPage,
      page:this.state.page
    }
    let hasil = this.state.searchRows

    if(hasil){
      param.search_all = hasil
    }
    const data = await getAllProfileNasabahFunction(param)
    
    if(data){
      if(!data.error && data.borrowerList){
        const dataNasabah = data.borrowerList && data.borrowerList.data;
    
        for (const key in dataNasabah){
          dataNasabah[key].category = dataNasabah[key].category && dataNasabah[key].category==="account_executive"?"Account Executive" :dataNasabah[key].category === "agent"?"Agent":"Personal"
          dataNasabah[key].loan_status = dataNasabah[key].loan_status && dataNasabah[key].loan_status==="active"?"Aktif" :"Tidak Aktif"
        }

        this._isMounted && this.setState({loading:false,
          rows:dataNasabah,
          rowsPerPage:data.borrowerList.rows,
          total_data:data.borrowerList.total_data,
          last_page:data.borrowerList.last_page,
          page:data.borrowerList.current_page})
      }else{
        this._isMounted && this.setState({errorMessage:data.error, loading:false})
      }
    }
  }

  onBtnSearch = (e)=>{
    this.setState({loading:true,searchRows:e.target.value,page:1},()=>{
      if(this.state.paging){
      this.getProfileNasabah()
    }
    })
  }
  
  onChangePage = (current) => {
    
    this.setState({loading:true,page:current},()=>{

      if(this.state.paging){
        this.getProfileNasabah()
      }
    })
  }
  
  render() {
    if(getTokenClient()&&getTokenAuth()){
      return (
        <div style={{padding:0}}>

          < TableComponent
            id={"id"}
            title={'Nasabah - List'}
            search={
              {
                value: this.state.searchRows,
                label: 'Search ID Nasabah, Nama Nasabah',
                function: this.onBtnSearch,
              }
            }
            errorMessage={this.state.errorMessage}
            paging={this.state.paging}
            loading={this.state.loading}
            columnData={columnDataUser}
            data={this.state.rows}
            page={this.state.page}
            rowsPerPage={this.state.rowsPerPage}
            totalData={this.state.total_data}
            onChangePage={this.onChangePage}             
            permissionDetail={ checkPermission('lender_borrower_list_detail') ? '/profileNasabahDetail/' : null}
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
      id: state.user.id
  }
}
export default connect (mapStateToProp)(profileNasabah) ;