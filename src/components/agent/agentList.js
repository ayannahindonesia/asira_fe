import React from 'react'
import { Redirect } from 'react-router-dom'
import {getAllAgentFunction} from './saga'
import { checkPermission } from '../global/globalFunction';
import { getToken } from '../index/token'
import TableComponent from '../subComponent/TableComponent'
import { destructAgent } from './function';
import SearchBar from '../subComponent/SearchBar';


const columnDataAgent = [
    {
        id: 'id',
        numeric: false,
        label: 'Id Agen',
    },
    {
        id: 'name',
        numeric: false,
        label: 'Nama Agen',
    },
    {
        id: 'category_name',
        numeric: false,
        label: 'Kategori',
    },
    {
        id: 'instansi',
        numeric: false,
        label: 'Instansi',
    },
    { 
        id: 'status', 
        numeric: false, 
        label: 'Status' 
    },
]

class AgentList extends React.Component{
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            loading:true, 
            listAgent: [],
            paging: true,
            page: 1,
            rowsPerPage: 10,
            search: '',
        }
    }

    componentDidMount(){
        this._isMounted = true;
        this.refresh()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // onBtnSearch = () => {
    //     this.setState({page:1}, () => {
    //         this.refresh()
    //     })
    // }

    changeSearch = (e) => {
        this.setState({
            loading:true,
            page: 1,
            search: e.target.value,
        }, () => {
            this.refresh();
        })
    }

    refresh = async function(){
        const param = {};

        if(this.state.paging) {
            param.rows = this.state.rowsPerPage;
            param.page = this.state.page;
        }

        param.search_all = this.state.search

        const data = await getAllAgentFunction(param);

        if(data) {
            if(!data.error) {
                const dataListAgent = destructAgent(data.dataAgent, true);
                
                this.setState({
                    listAgent: dataListAgent,
                    totalData: data.totalData,
                    loading: false,
                })
            } else {
                this.setState({
                    errorMessage: data.error,
                    loading: false,
                })
            }      
        }
    }

    onChangePage = (current) => {
        this.setState({
            loading:this.state.paging,
            page:current,
        }, () => {
            if(this.state.paging) {
                this.refresh()
            };
        })
    }

    render(){

        if(getToken()){
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-7">
                            <h2 className="mt-3">Agen - List</h2>
                        </div>
                        <div className="col-8" style={{color:"red",fontSize:"15px",textAlign:'left'}}>
                            {this.state.errorMessage}
                        </div>   
                        <div className="col-4">
                            <SearchBar
                                onChange={this.changeSearch}
                                placeholder="Search ID Agen, Nama Agen.."
                                value={this.state.search}
                            />
                        </div> 
                    </div>

                    <hr/>

                    < TableComponent
                        id={"id"}
                        paging={this.state.paging}
                        loading={this.state.loading}
                        columnData={columnDataAgent}
                        data={this.state.listAgent}
                        page={this.state.page}
                        rowsPerPage={this.state.rowsPerPage}
                        totalData={this.state.totalData}
                        onChangePage={this.onChangePage}             
                        permissionEdit={ checkPermission('core_agent_patch') ? '/editAgent/' : null}
                        permissionDetail={ checkPermission('core_agent_details') ? '/detailAgent/' : null}
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

export default AgentList;