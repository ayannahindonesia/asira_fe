import React from 'react'
import Loader from 'react-loader-spinner'
import { Link } from 'react-router-dom'
import { listProductFunction } from './saga';
import {checkPermission} from './../global/globalFunction'
import { Redirect } from 'react-router-dom'
import { getToken } from '../index/token';
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
        id: 'status',
        numeric: false,
        label: 'Status Produk',
    }
]
class ProductList extends React.Component{
    _isMounted = false;
    state={
        loading:true,paging:true,
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
        const data = await listProductFunction (params)

        const dataProduct = data.productList && data.productList.data;
        
        for(const key in dataProduct) {
            dataProduct[key].status = dataProduct[key].status && dataProduct[key].status === 'active' ? 'Aktif' : 'Tidak Aktif'
        }
        
        if(data){
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
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    onChangePage = (current) => {
        this.setState({loading:true, page : current}, () => {
            if(this.state.paging){
                this.getAllProduct()
            }
        })
    }


    renderJSX = () => {
        if (this.state.loading){
            return  (
              <tr  key="zz">
                <td align="center" colSpan={5}>
                      <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
              />   
                </td>
              </tr>
            )
        }else{
            if(this.state.rows.length===0){
                return(
                  <tr>
                     <td align="center" colSpan={6}>Data empty</td>
                  </tr>
                )
              }else{
                var jsx = this.state.rows.map((val,index)=>{
                  return (
                      <tr key={index}>
                        <td align="center">{this.state.page >0 ? index+1 + (this.state.rowsPerPage*(this.state.page -1)) : index+1}</td>
                        <td align="center">{val.id}</td>
                        <td align="center">{val.name}</td>
                        <td align="center">{val.status ==="active"?"Aktif":"Tidak Aktif"}</td>               
                        <td align="center">
                      
                         {checkPermission('core_product_patch') &&
                            <Link to={`/productedit/${val.id}`} className="mr-2">
                            <i className="fas fa-edit" style={{color:"black",fontSize:"18px"}}/>
                            </Link>
                        }
                        {checkPermission('core_product_detail') &&
                            <Link to={`/productdetail/${val.id}`} >
                            <i className="fas fa-eye" style={{color:"black",fontSize:"18px"}}/>
                            </Link>
                        }
                        
                        </td>
                      </tr>
                  )
              })
               return jsx;
              }   
        }
    }


    render(){
        if(getToken()){
            return(
                <div className="container">
                    <h2>Product - List</h2>
                    <div className="form-group row">
                                        <div style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                                {this.state.errorMessage}
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
                        permissionDetail={ checkPermission('core_product_detail') ? '/productdetail/' : null}
                        permissionEdit={ checkPermission('core_product_patch') ? '/productedit/' : null}

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

export default ProductList;