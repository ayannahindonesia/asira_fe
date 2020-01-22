import React from 'react'
import { Redirect } from 'react-router-dom'
import { checkPermission } from '../global/globalFunction';
import { getAllLayananListFunction } from './saga';
import { getToken } from '../index/token';
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
    {
        id: 'id',
        numeric: false,
        label: 'ID Layanan',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Nama Layanan',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status Layanan',
    }
  ]
class LayananList extends React.Component{
    _isMounted = false;
    
    state={
        loading:true,paging:true,
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,dataPerhalaman:5,
    }
    componentDidMount (){
        this._isMounted=true
        this.getAllList()
    }
    componentWillUnmount(){
        this._isMounted=false
    }
    
    getAllList = async function (){
        const param={
            page: this.state.page,
            rows:10
        }
        const data = await getAllLayananListFunction(param)
        const listLayanan = data.listLayanan &&data.listLayanan.data

        for (const key in listLayanan){
            listLayanan[key].status =  listLayanan[key].status&&  listLayanan[key].status === 'active'?"Aktif":"Tidak Aktif"
        }

        if(data){
            if(!data.error){
                this.setState({loading:false,rows:data.listLayanan.data,
                    total_data:data.listLayanan.total_data,
                    page:data.listLayanan.current_page,
                    from:data.listLayanan.from,
                    to:data.listLayanan.to,
                    last_page:data.listLayanan.last_page,
                    dataPerhalaman:data.listLayanan.rows,
                })
            }else{
                this.setState({errorMessage:data.error,loading:false})
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
                   <h2 className="mt-3">Layanan List</h2>
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
                        permissionDetail={ checkPermission('core_service_detail') ? '/layanandetail/' : null}
                        permissionEdit={ checkPermission('core_service_patch') ? '/layananedit/' : null}

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

export default LayananList;