import React from 'react';
import PropTypes from 'prop-types';
import localeInfo from 'rc-pagination/lib/locale/id_ID';
import Pagination from 'rc-pagination';
import {Link} from 'react-router-dom';
import Loader from 'react-loader-spinner';
import { formatNumber, handleFormatDate } from '../global/globalFunction';
import CheckBox from '@material-ui/core/Checkbox';
import './../../support/css/table.css'
import { Grid, Button, IconButton, Tooltip } from '@material-ui/core';
import TitleBar from './TitleBar';
import SearchBar from './SearchBar';
import DatePicker from "react-date-picker";
import PaymentIcon from '@material-ui/icons/Payment';
import "react-datepicker/dist/react-datepicker.css";

class TableComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      page: 1,
      rowsPerPage: 10,
    };
  }

  onChecked = (id, arrayCheckedBox) => {
    let flag = false;

    for(const key in arrayCheckedBox) {
      if(arrayCheckedBox[key].toString() === id.toString() || arrayCheckedBox[key].toString() === 'all') {
        flag = true;
        break;
      }
    }

    return flag;
  }

  checkConditionButton = (dataTable, conditions) => {
    let flag = false;

    for(const keyCondition in conditions) {
      if(conditions[keyCondition].toString().includes('<') || conditions[keyCondition].toString().includes('>') ) {
        let dataOne = keyCondition;
        let dataSecond = conditions[keyCondition].toString().split('<')[1];

        if(dataSecond.includes('date')) {
          dataOne = new Date(dataTable[dataOne]);
          dataOne.setHours(0,0,0,0)
          dataSecond = new Date();
          dataSecond.setHours(0,0,0,0)

          if(conditions[keyCondition].toString().includes('<')) {
            flag = dataOne.getTime() <= dataSecond.getTime();
          } else {
            flag = dataOne.getTime() >= dataSecond.getTime();
          }
          
        } else {
          if(conditions[keyCondition].toString().includes('<')) {
            flag = dataTable[dataOne] < dataTable[dataSecond];
          } else {
            flag = dataTable[dataOne] > dataTable[dataSecond];
          }
        }       

      } else if(dataTable[keyCondition] === conditions[keyCondition]) {
        flag = true;
      } else {
        flag = false;
      }

      if(!flag) {
        break;
      }
    }
    
    return flag;
  }

  checkWordCondition = (stringCondition, dataTable) => {
    let word = `Ter${stringCondition.toLowerCase()}`

    if(word === 'Terubah' && !dataTable.disburse_date_changed) {
      word = '-'
    } else if (word === 'Terkonfirmasi' &&  dataTable.disburse_status === 'processing') {
      word = 'Diproses'
    }


    return word;
  }

  renderTable = () => {
    return (
      <Grid item sm={12} xs={12}>

        <table className="table table-hover">
          <thead className="theadCustom">
            <tr >
              {
                this.props.checkBoxAction && this.props.data && this.props.data.length !== 0 &&
                <th className="text-center" scope="col" key={'CheckBox'} style={{padding:0}}>
                  <CheckBox
                    checked={this.onChecked('all', this.props.arrayCheckBox)}
                    onClick={this.props.checkBoxAction}
                    value={'all'}
                    color="default"
                  />
                </th>
              }
              
              {
                this.props.columnData.map((data,index) => {
                  if(!data.hidden) {
                    return (
                      <th className="text-center" scope="col" key={index}>{data.label}</th>
                    );
                  }

                  return null
                  
                },this) 
              }
              
              { (this.props.permissionDetail || this.props.permissionEdit || this.props.permissionPaid) && <th className="text-center" scope="col">Action</th>}
            </tr>     
          </thead>
          <tbody>
            {
              
              this.props.loading &&
              <tr  key="zz"  className="tBodycustom">
                <td align="center" colSpan={12}>
                  <Loader 
                    type="Circles"
                    color="#00BFFF"
                    height="40"	
                    width="40"
                  />   
                </td>
              </tr>
            }

            {
              !this.props.loading && (!this.props.data || (this.props.data &&  this.props.data.length === 0 )) &&
              <tr  key="failed"  className="tBodycustom"><td align="center" colSpan={12}>{'No Data'}</td></tr>
            }
          
            {
              !this.props.loading && this.props.data && this.props.data.length > 0 && this.props.data.map((dataTable,index) => {  

                if(this.props.paging || (index >= ((this.props.page-1) * (this.props.rowsPerPage)) && index <= (this.props.rowsPerPage * this.props.page) - 1 )) {   
                  return (
                    <tr key={index}  className="tBodycustom"> 
                      {
                        this.props.checkBoxAction &&
                        <td align="center" style={{padding: '2px 0px 0px 0px'}}>
                          <CheckBox
                            checked={this.onChecked(dataTable[this.props.id], this.props.arrayCheckBox)}
                            onClick={this.props.checkBoxAction}
                            value={dataTable[this.props.id]}
                            color="default"
                          />
                        </td>
                      }
                    
                      {
                        this.props.columnData.map((dataRow, indexRow) => {   
                          if(!dataRow.hidden) {
                            
                            if(!dataTable[dataRow.id] && (!dataRow.type || dataRow.type !== 'button')) {
                              return <td align={dataRow.numeric ? "right" : "center"} key={indexRow}> {'-'} </td>
                            } else if(dataRow.type && dataRow.type === 'datetime'){
                              return <td align={dataRow.numeric ? "right" : "center"} key={indexRow}> {handleFormatDate(dataTable[dataRow.id])} </td>
                            } else if(dataRow.type && dataRow.type === 'button'){ 
                              return (
                                <td align={dataRow.numeric ? "right" : "center"} key={indexRow}>
                                  {
                                    this.checkConditionButton(dataTable, dataRow.conditions) && dataRow.permission &&
                                    <Button disableElevation
                                      variant='contained'
                                      style={{backgroundColor: '#2076B8', color:'white'}}
                                      onClick={(e) => {dataRow.function(e, dataTable[this.props.id])}}
                                      value={dataTable[this.props.id]}
                                      disabled={!dataRow.permission}
                                    >
                                      <b>{dataRow.id}</b>
                                    </Button>
                                  }
                                  {
                                    this.checkConditionButton(dataTable, dataRow.conditions) && !dataRow.permission &&
                                    '-'
                                  }
                                  {
                                    !this.checkConditionButton(dataTable, dataRow.conditions) &&
                                    this.checkWordCondition(dataRow.id, dataTable)
                                  }
                                </td>
                              )
                              
                            }
                              return(
                                <td align={dataRow.numeric ? "right" : "center"} key={indexRow}>
                                  
                                  {
                                    !dataRow.type &&  dataRow.numeric === true && formatNumber(dataTable[dataRow.id]) 
                                  }
                                  {
                                    !dataRow.type &&  !dataRow.numeric ? dataTable[dataRow.id] : '-'
                                  }
                                  
                                </td>
                              ); 
                            
                             
                          }                      
                          return null      
                        }, this)
                      }
                      <td align="center">
                        { this.props.permissionEdit &&
                          <Link to={`${this.props.permissionEdit}${dataTable[this.props.id]}`} className="mr-2">
                            <i className="fas fa-edit" style={{color:"#2076B8",fontSize:"18px"}}/>
                          </Link>
                        }
                        { this.props.permissionDetail &&
                          <Link to={`${this.props.permissionDetail}${dataTable[this.props.id]}`} >
                            <img src={require('./../../icons/mata.svg')} alt={<i className="fas fa-eye" style={{color:"#2076B8",fontSize:"18px"}}/>} style={{maxWidth:'30%'}}/>
                            
                          </Link>
                        }

                        {
                          this.props.permissionPaid &&
                          <Tooltip title="Detail & Bayar" style={{outline:'none'}}>
                            <IconButton aria-label="paid" style={{color:'#2076B8', outline:'none', padding:'unset'}} onClick={(e) => this.props.permissionPaid(e, dataTable[this.props.id])} >
                              <PaymentIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      </td>
                    

                    </tr>
                  )
                } else {
                  return null
                }
              }, this)
            }
          </tbody>
        </table>
        
        {
          this.props.button && this.props.button.map((buttonChild, indexButton) => {
            return (
              <Button disableElevation
                key={indexButton}
                variant='outlined'
                style={{border:`2px solid ${buttonChild.color || '#2076B8'}`,color:buttonChild.color || '#2076B8'}}
                onClick={buttonChild.function}
              >
                <b>{buttonChild.label}</b>
              </Button>
            );
          })
        }

        <nav className="navbar" style={{float:"right"}}> 

          <Pagination className="ant-pagination"  
            current={this.props.page}
            showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
            total={this.props.totalData}
            showLessItems
            pageSize={this.props.rowsPerPage}
            onChange={this.props.onChangePage}
            locale={localeInfo}
          />     
        </nav>
      </Grid>

    );
  }

  render() {
    return (
      <Grid container >
        {
          this.props.title &&
          <Grid item sm={12} xs={12}>

            <TitleBar
              title={this.props.title}
            />
          </Grid>
        }
        

        <Grid 
          item 
          sm={12} xs={12}
          style={this.props.title && {padding:20, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                                     
        >
          
          <Grid container>
            <Grid item sm={12} xs={12} style={{color:"red",fontSize:"15px",textAlign:'left'}}>
              {this.props.errorMessage}
            </Grid>


            {
              this.props.searchDate &&
              <Grid item sm={12} xs={12} style={{marginBottom:'10px'}}>
                <Grid container>
                  <Grid item sm={2} xs={12} style={{color:'#2076B8', fontSize:'16px'}}>
                    <b> {this.props.searchDate.label} </b>
                  </Grid>

                  <Grid item sm={5} xs={12} style={{maxWidth:'330px'}}>
                    {
                      this.props.searchDate.value && 
                      <Grid container>

                        <Grid item sm={5} xs={5} style={{maxWidth:'130px'}}>
                          <DatePicker
                            format="yyyy-MM-dd"
                            style={{width:'100%'}}
                            value={
                              (typeof(this.props.searchDate.value) === 'object' ? this.props.searchDate.value[0] : this.props.searchDate.value) || new Date()
                            }
                            onChange={this.props.searchDate.function ? (this.props.searchDate.function[0] ? this.props.searchDate.function[0] : this.props.searchDate.function) : null}
                            clearIcon={null}
                          />
                        </Grid>

                        { typeof(this.props.searchDate.value) === 'object' &&
                          <Grid item sm={1} xs={1}>
                            <hr style={{maxWidth:'10px',borderTop:'1px solid black'}}></hr>
                          </Grid>
                        }

                        { typeof(this.props.searchDate.value) === 'object' &&
                          <Grid item sm={5} xs={5} style={{maxWidth:'130px'}}>
                            <DatePicker
                              format="yyyy-MM-dd"
                              value={this.props.searchDate.value[1] || new Date()}
                              onChange={(this.props.searchDate.function && this.props.searchDate.function[1]) || null}
                              clearIcon={null}
                            />
                          </Grid>
                        }
                        

                      </Grid>
                    }
                  </Grid>

                  <Grid item sm={5} xs={12}>
                    {
                      this.props.searchDate.button &&
                      <Grid container>
                        {
                          this.props.searchDate.button.map((buttonChild, index) => {
                            return (
                              <Grid key={index} item sm={parseInt(12 /(this.props.searchDate.button.length))} xs={parseInt(12 /(this.props.searchDate.button.length))} style={{maxWidth:'100px'}}>
                                <Button disableElevation
                                  variant='contained'
                                  style={{padding: '2px', minWidth:'80px',backgroundColor: buttonChild.color || '#2076B8', color:'white'}}
                                  onClick={buttonChild.function}
                                >
                                  <b>{buttonChild.label}</b>
                                </Button>
                              </Grid>
                              
                            )
                          })
                        }
                      </Grid>
                    }
                  </Grid>

                </Grid>
              
              </Grid>
            }

            <Grid item sm={12} xs={12}>
              {
                this.props.search &&
                <SearchBar
                  id="search"
                  value={this.props.search.value}
                  placeholder={this.props.search.label || 'Cari...'}
                  onChange={this.props.search.function || null} 
                  float={'right'}
                />
              }
              
            </Grid>

            {
              this.renderTable()
            }
            
          </Grid>
          

        </Grid>
        
      </Grid>
    );
  }
}

TableComponent.propTypes = {
  paging:PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onChangePage: PropTypes.func,
  totalData: PropTypes.number,
  disabled: PropTypes.bool,
  permissionEdit: PropTypes.string,
  permissionDetail: PropTypes.string,
  id: PropTypes.string,
  loading: PropTypes.bool,
};

export default (TableComponent);
