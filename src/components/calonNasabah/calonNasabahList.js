import React from 'react'
import { Redirect } from 'react-router-dom'
import {getAllBorrowerFunction} from './saga'
import { checkPermission, handleFormatDate } from '../global/globalFunction';
import { getTokenClient } from '../index/token'
import TableComponent from '../subComponent/TableComponent'


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
    { id: 'created_at', numeric: false, label: 'Tanggal Registrasi'},
]

class CalonNasabahList extends React.Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            paging:true,
            loading:true, 
            listUser: [],
            page: 1,
            rowsPerPage: 10,
            totalData: 0,
            search: '',
        }
    }

    componentDidMount(){
        this._isMounted = true;
        this._isMounted && this.refresh()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    refresh = async function(){
        const param = {};
        param.search_all = this.state.search;

        param.rows = this.state.rowsPerPage;
        param.page = this.state.page;

        const data = await getAllBorrowerFunction(param);

        if(data) {
            if(!data.error) {
                const dataListUser = data.dataUser || [];

                if(dataListUser.length !== 0) {
                    for(const key in dataListUser) {
                        dataListUser[key].created_at = dataListUser[key].created_at && handleFormatDate(dataListUser[key].created_at)
                        dataListUser[key].category = this.isCategoryExist(dataListUser[key].category) 
                    }
                }

                this._isMounted && this.setState({
                    errorMessage:'',
                    listUser: dataListUser,
                    totalData: data.totalData,
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

    isCategoryExist = (category) => {
        if(category && category.toString().toLowerCase() === 'agent') {
          return 'Agen'
        } else if(category && category.toString().toLowerCase() === 'account_executive') {
          return 'Account Executive'
        } 
  
        return 'Personal';
    }

    onChangePage = (current) => {
        this.setState({
            loading:true,
            page:current,
        }, () => {
            if(this.state.paging) {
                this.refresh()
            };
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
                        errorMessage={this.state.errorMessage}
                        title={'Calon Nasabah - List'}
                        search={
                            {
                              value: this.state.search,
                              label: 'Search ID, Nama Nasabah',
                              function: this.changeSearch,
                            }
                          }
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.listUser}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.totalData}
                        onChangePage={this.onChangePage}             
                        permissionDetail={ checkPermission('lender_borrower_list_detail') ? '/detailCalonNasabah/' : null}
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

export default CalonNasabahList;