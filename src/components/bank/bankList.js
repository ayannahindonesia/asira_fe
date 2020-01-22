import React from 'react'
import { Redirect } from 'react-router-dom'
import {getAllBankList} from './saga'
import { checkPermission } from '../global/globalFunction';
import 'rc-pagination/assets/index.css';
import './../../support/css/pagination.css'
import { getToken } from '../index/token';
import SearchBar from './../subComponent/SearchBar'
import TableComponent from './../subComponent/TableComponent'


const columnDataUser = [
  {
      id: 'id',
      numeric: false,
      label: 'Bank ID',
  },
  {
      id: 'name',
      numeric: false,
      label: 'Nama Bank',
  },
  {
      id: 'pic',
      numeric: false,
      label: 'PIC',
  }
]

class BankList extends React.Component{
  
    _isMounted=false;
    state={
        loading:true,
        paging:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,dataPerhalaman:5,
        search: '',
    }
    componentDidMount(){
      this._isMounted=true
        this.getAllBankData()
    }
    componentWillUnmount(){
      this._isMounted=false

    }

    getAllBankData = async function () {
        let param = { 
          page: this.state.page,
          rows:10
        }
        
        var hasil = this.state.search;

        if(hasil.toString().trim().length !== 0) {
          param.search_all = hasil
        }
        
        
        const data = await getAllBankList(param)
        if(data){
          if(!data.error){
            this.setState({
              rows:data.bankList.data,
              total_data:data.bankList.total_data,
              page:data.bankList.current_page,
              from:data.bankList.from,
              to:data.bankList.to,
              last_page:data.bankList.last_page,
              dataPerhalaman:data.bankList.rows,
              loading:false})
          }else{
              this.setState({errorMessage:data.error})
          }
        }
    }

    onBtnSearch = (e)=>{
      this.setState({loading : true, page:1,search:e.target.value},()=>{
        this.getAllBankData()
      })
    }


    onChangePage = (current) => {
      
        this.setState({loading:true, page : current}, () => {
          if(this.state.paging){
            this.getAllBankData()
          }
        })
    }

 
    render(){
        if(getToken()){
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-7">
                             <h2 className="mt-3">List - Bank</h2>
                        </div>
                        <div className="col-4 mt-3 ml-5">
                        <div className="input-group">
                          <SearchBar 
                            onChange={this.onBtnSearch}
                            placeholder="Search Nama Bank, ID Bank.."
                            value={this.state.search}
                          />

                        </div>
                        </div>
                    </div>
                   <hr/>

                   < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.rows}
                        page={this.state.page}
                        rowsPerPage={this.state.dataPerhalaman}
                        totalData={this.state.total_data}
                        onChangePage={this.onChangePage}             
                        permissionDetail={ checkPermission('core_bank_detail') ? '/bankdetail/' : null}
                        permissionEdit={ checkPermission('core_bank_patch') ? '/bankedit/' : null}

                    />
                   
               
               
                </div>
            )
        }
        if(!getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default BankList;