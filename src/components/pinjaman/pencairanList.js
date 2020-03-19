import React from 'react'
import { Redirect } from 'react-router-dom'
import { getPermintaanPinjamanFunction } from './saga';
import { checkPermission } from '../global/globalFunction';
import { getTokenClient } from '../index/token';
import TableComponent from '../subComponent/TableComponent'

const columnDataPencairan = [
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
        id: 'disburse_date',
        numeric: false,
        type:'datetime',
        label: 'Tanggal Pencairan',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status',
    },
]

class PencairanList extends React.Component{
    _isMounted = false;

    state = {
        loading:true, 
        listPencairan: [],
        paging: true,
        page: 1,
        rowsPerPage: 10,
        totalData: 0,
        search: '',
    }

    componentDidMount(){
        this._isMounted = true;
        this._isMounted && this.refresh()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    refresh = async function(){
        const param = {
            disburse_status: 'confirmed',
            status: 'approved',
        };

        param.search_all = this.state.search;
        param.rows = this.state.rowsPerPage;
        param.page = this.state.page;

        const data = await getPermintaanPinjamanFunction(param);

        if(data) {
            if(!data.error) {
                const listPencairan = data.loanRequest.data;

                for(const key in listPencairan) {
                    if(listPencairan[key].status === 'approved') {
                        listPencairan[key].status = 'Telah Dicairkan'
                    } else {
                        listPencairan[key].status = 'Belum Dicairkan'
                    }
                }

                this._isMounted && this.setState({
                    listPencairan: data.loanRequest.data ,
                    totalData: data.loanRequest.total_data,
                    loading: false,
                })
            } else {
                this._isMounted && this.setState({
                    errorMessage: data.error,
                    loading: false,
                })
            }      
        }
    }

    onChangePage = (current, pageSize) => {
        this.setState({
            loading:true,
            page:current,
        }, () => {
            this.refresh();
        })
    }
    
    changeSearch = (e) => {
        this.setState({
            loading:true,
            page: 1,
            search: e.target.value,
        }, () => {
            this.refresh();
        })
    }

    render(){
        
        
        if(getTokenClient()){
            return(
                <div style={{padding:0}}>

                   < TableComponent
                        id={"id"}
                        title={'Pinjaman Cair - List'}
                        errorMessage={this.state.errorMessage}
                        search={
                            {
                              value: this.state.search,
                              label: 'Search ID Pinjaman, Nama Nasabah',
                              function: this.changeSearch,
                            }
                        }
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataPencairan}
                        data={this.state.listPencairan}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.totalData}
                        onChangePage={this.onChangePage}             
                        permissionDetail={ checkPermission('lender_loan_request_detail') ? '/pinjamanDetail/' : null}
                    />

                  
                </div>
            )
        }
        if(!getTokenClient()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default PencairanList;