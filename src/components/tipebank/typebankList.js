import React from 'react'
import { Redirect } from 'react-router-dom'
import {ListTipeBankFunction} from './saga'
import { checkPermission } from '../global/globalFunction';
import { getToken } from '../index/token';
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
    {
        id: 'id',
        numeric: false,
        label: 'ID Tipe Bank',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Nama Tipe Bank',
    },

]

class TambahBankList extends React.Component{
    _isMounted = false;

    state={
        loading:true,paging:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10
    }
    componentDidMount (){
        this._isMounted = true;
        this.getAllList()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    getAllList = async function () {
        const param = {
            page:this.state.page,
            rows:10
        };
        const data  = await ListTipeBankFunction(param)
        if(data){
            if(!data.error){
                this.setState({loading:false,
                    rows:data.listBankType.data,
                    total_data:data.listBankType.total_data,
                    page:data.listBankType.current_page,
                    from:data.listBankType.from,
                    to:data.listBankType.to,
                    last_page:data.listBankType.last_page,
                    rowsPerPage:data.listBankType.rows,
                })
            }else{
                this.setState({loading:false,errorMessage:data.error})
            }
        }
        
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
            if (this.state.paging){
                this.getAllList()
            }
        })
    }
  
   

    render(){
        if(getToken()){
            return(
                <div className="container">
                   <h2 className="mt-3">Tipe Bank - List</h2>
                   <hr/>
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
                        permissionEdit={ checkPermission('core_bank_type_patch') ? '/banktypeedit/' : null}
                        permissionDetail={ checkPermission('core_bank_type_detail') ? '/banktypedetail/' : null}

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

export default TambahBankList;