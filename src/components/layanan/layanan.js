import React from 'react';
import { Redirect } from 'react-router-dom'
import './../../support/css/pagination.css'
import { getAllLayananListFunction } from './saga'
import 'moment/locale/id';
import { getTokenClient,getTokenAuth } from '../index/token'
import TableComponent from './../subComponent/TableComponent'
import { checkPermission } from '../global/globalFunction';

const columnDataUser = [
  {
      id: 'id',
      numeric: false,
      label: 'ID',
  },
  {
      id: 'name',
      numeric: false,
      label: 'Nama Layanan',
  },
  {
      id: 'status',
      numeric: false,
      label: 'Status',
  }
]

class Layanan extends React.Component {
  
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
    //loading:true,
  };
  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  componentDidMount(){
    this._isMounted=true
   this._isMounted && this.getLayananList()
  }
  componentWillUnmount(){
    this._isMounted=false
  }
  
  //Ambil data pertama kali
  getLayananList = async function(){
    const param ={
      rows:this.state.rowsPerPage,
      page:this.state.page
    }
    let hasil = this.state.searchRows.toLowerCase()

    if(hasil){
      param.search_all = hasil
    }
    const data = await getAllLayananListFunction(param)
    const dataNasabah = data.layananList.data;

    for (const key in dataNasabah){
        dataNasabah[key].status = dataNasabah[key].status ==='active'?"Aktif":"Tidak Aktif"
    }

    if(data){
      if(!data.error){
        this._isMounted && this.setState({loading:false,
          rows:dataNasabah,
          rowsPerPage:data.layananList.rows,
          total_data:data.layananList.total_data,
          last_page:data.layananList.last_page,
          page:data.layananList.current_page})
      }else{
        this._isMounted && this.setState({errorMessage:data.error})
      }
    }
  }

  onBtnSearch = (e)=>{
    this.setState({loading:true,searchRows:e.target.value,page:1},()=>{
      if(this.state.paging){
        this.getLayananList()
    }
    })
  }
  
  onChangePage = (current) => {
    this.setState({loading:true,page:current},()=>{
      if(this.state.paging){
        this.getLayananList()
      }
    })
  }
  
  render() {
    if(getTokenClient()&&getTokenAuth()){
      return (
        <div style={{padding:0}}>
          < TableComponent
            id={"id"}
            title={'Layanan - List'}
            search={
              {
                value: this.state.searchRows,
                label: 'Search ID, nama Layanan',
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
            permissionDetail={ checkPermission('lender_service_list') ? '/layananDetail/' : null}
          /> 
        </div>
      );
    }
    else if(getTokenAuth()){
      return  <Redirect to='/login' />
    }
  }
}

export default (Layanan) ;