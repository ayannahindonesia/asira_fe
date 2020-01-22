import React from 'react';
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import './../../support/css/pagination.css'
import { getToken } from '../index/token';
import { checkPermission } from '../global/globalFunction';
import { getPenyediaAgentListFunction } from './saga';
import SearchBar from './../subComponent/SearchBar'
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
  {
      id: 'id',
      numeric: false,
      label: 'ID Penyedia Agen',
  },
  {
      id: 'name',
      numeric: false,
      label: 'Nama Penyedia Agen',
  },
  {
      id: 'status',
      numeric: false,
      label: 'Status',
  },
]

class profileNasabah extends React.Component {
  state = {
    rows: [], searchRows:'',
    page: 1,
    rowsPerPage: 5,
    isEdit: false,
    editIndex:Number,
    total_data:0,
    last_page:1,
    loading:true,
    bankID:0,bankName:'',paging:true
  
  };

  //-----------------------------------NIKO FUNCTION-------------------------------------------------------------
  
  _isMounted = false
  componentDidMount(){
    this.getAllData()
    this._isMounted = true
  }
  componentWillUnmount(){
    this._isMounted = false
  }

  //Ambil data pertama kali
  getAllData = async function(){
      const param ={
        rows:10,
        page:this.state.page
      }
      let hasil = this.state.searchRows

      if (hasil){
       param.search_all = hasil
      }

      const data = await getPenyediaAgentListFunction(param)
      const dataAgent = data.dataListAgent && data.dataListAgent.data
      for (const key in dataAgent){
        dataAgent[key].status = dataAgent[key].status ==='active'?"Aktif":"Tidak Aktif"
      }
      if(data){
        if(!data.error){
          this.setState({loading:false,rows:data.dataListAgent.data,
            rowsPerPage:data.dataListAgent.rows,
            jumlahBaris:null,
            total_data:data.dataListAgent.total_data,
            last_page:data.dataListAgent.last_page,
            page:data.dataListAgent.current_page})
        }else{
          this.setState({errorMessage:data.error})
        }
      }
  }

  onBtnSearch = (e)=>{
    this.setState({loading:true,searchRows:e.target.value,page:1},()=>{
      if(this.state.paging){
        this.getAllData()
      }
    })
  
  }

 
 
 // rpp =5
 // p = 3
 // index = 11

 onChangePage = (current) => {
  this.setState({loading:true,page:current},()=>{
    if(this.state.paging){
      this.getAllData()
    }
  })
}
  
render() {   
if(getToken()){
    return (
        <div className="container">
         <div className="row">
                        <div className="col-6">
                             <h2 className="mt-3">Penyedia Agen - List</h2>
                        </div>
                        <div className="col-5 mt-3 ml-5">
                        <div className="input-group">
                        <SearchBar 
                            onChange={this.onBtnSearch}
                            placeholder="Search ID atau Nama Penyedia Agen.."
                            value={this.state.searchRows}
                          />
                        
                        </div>
                        </div>
          </div>
        <hr></hr>
                     < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.rows}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.total_data}
                        onChangePage={this.onChangePage}             
                        permissionEdit={ checkPermission('core_agent_provider_patch') ? '/penyediaEdit/' : null}
                        permissionDetail={ checkPermission('core_agent_provider_details') ? '/penyediaDetail/' : null}

                    /> 
         
        </div>
    );

}
    else if(!getToken()){
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