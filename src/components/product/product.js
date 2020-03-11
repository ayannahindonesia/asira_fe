import React from 'react'
import { listProductFunction } from './saga';
import {checkPermission, formatNumber} from './../global/globalFunction'
import { Redirect } from 'react-router-dom'
import { getTokenClient,getTokenAuth } from '../index/token'
import TableComponent from './../subComponent/TableComponent'

const columnDataUser = [
    {
        id: 'id',
        numeric: false,
        label: 'ID Produk',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Nama Produk',
    },
    {
        id: 'tenor',
        numeric: false,
        label: 'Tenor',
    },
    {
        id: 'rentangPengajuan',
        numeric: false,
        label: 'Rentang Pengajuan (Rp)',
    },
    {
        id: 'interest',
        numeric: false,
        label: 'Bunga (%)',
    },
    {
        id: 'status',
        numeric: false,
        label: 'Status Produk',
    }
]
class ProductList extends React.Component{
    _isMounted = false;
    state={
        loading:true,paging:true,search:'',
        rows:[],total_data:10,page:1,from:1,to:3,last_page:1,rowsPerPage:10,dataPerhalaman:5,errorMessage:null
    }
    componentWillUnmount() {
        this._isMounted = false;
      }
    componentDidMount (){
        this._isMounted = true;
        this.getAllProduct()
    }
    getAllProduct = async function () {
        const params ={
            page:this.state.page,
            rows:10
        }
        var hasil = this.state.search;

        if(hasil.toString().trim().length !== 0) {
          params.search_all = hasil
        }
        
        const data = await listProductFunction (params)
        
        if(data){
            const dataProduct = data.productList && data.productList.data;
        
            for(const key in dataProduct) {
                dataProduct[key].status = dataProduct[key].status && dataProduct[key].status === 'active' ? 'Aktif' : 'Tidak Aktif'
                dataProduct[key].tenor = `${dataProduct[key].min_timespan || '0'} - ${dataProduct[key].max_timespan || 0} Bulan`
                dataProduct[key].rentangPengajuan = `Rp ${(dataProduct[key].min_loan && formatNumber(dataProduct[key].min_loan)) || '0'} - Rp ${(dataProduct[key].max_loan && formatNumber(dataProduct[key].max_loan)) || '0'}`
            }

            if(!data.error){
                this.setState({loading:false,rows:data.productList.data,
                    total_data:data.productList.total_data,
                    page:data.productList.current_page,
                    from:data.productList.from,
                    to:data.productList.to,
                    last_page:data.productList.last_page,
                    rowsPerPage:data.productList.rows,
                })
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
            if(this.state.paging){
                this.getAllProduct()
            }
        })
    }

    onBtnSearch = (e)=>{
        this.setState({loading : true, page:1,search:e.target.value},()=>{
                this.getAllProduct()
        })
      }
  
    render(){
    if(getTokenClient()&&getTokenAuth()){
            return(
                <div style={{padding:0}}>
                    < TableComponent
                        search={
                            {
                                value: this.state.search,
                                label: 'Search Nama Produk, ID Produk..',
                                function: this.onBtnSearch,
                            }
                        }
                        id={"id"}
                        title={'Produk - List'}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataUser}
                        data={this.state.rows}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.total_data}
                        onChangePage={this.onChangePage}         
                        permissionDetail={ checkPermission('lender_product_list') ? '/produkDetail/' : null}
                    /> 

                </div>
            )
        }
        if(getTokenAuth()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default ProductList;