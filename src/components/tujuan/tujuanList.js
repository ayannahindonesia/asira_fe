import React from 'react'
import { Redirect } from 'react-router-dom'
import {checkPermission} from './../global/globalFunction'
import {TujuanListFunction} from './saga'
import { getToken } from '../index/token';
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
    {
        id: 'id',
        numeric: false,
        label: 'ID Tujuan',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Tujuan Pembiayaan',
    },

]
class TujuanList extends React.Component{
    _isMounted = false
    state={
        loading:true,rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,paging:true
    }
    componentDidMount (){
        this._isMounted = true;
        this.getAllList()
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getAllList = async function () {
        const params = {
            page:this.state.page,
            rows:10
        }
        const data = await TujuanListFunction(params)

        if(data){
            if(!data.error){
                this.setState({loading:false,rows:data.data.data,
                    total_data:data.data.total_data,
                    page:data.data.current_page,
                    from:data.data.from,
                    to:data.data.to,
                    last_page:data.data.last_page,
                    rowsPerPage:data.data.rows,
                    
                })
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
            if(this.state.paging){
                this.getAllList()
            }
        })
    }

    render(){
        if(getToken()){
            return(
                <div className="container">
                   <h2 className="mt-3">Tujuan Pembiayaan - List</h2>
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
                        permissionEdit={ checkPermission('core_loan_purpose_patch') ? '/tujuanedit/' : null}
                        permissionDetail={ checkPermission('core_loan_purpose_detail') ? '/tujuandetail/' : null}

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

export default TujuanList;