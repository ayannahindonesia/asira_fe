import React from 'react';
import DatePicker from "react-date-picker";
import swal from 'sweetalert'
import { CSVLink } from "react-csv";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Loader from 'react-loader-spinner'
import "react-datepicker/dist/react-datepicker.css";
import {connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import './../../support/css/pagination.css'
import { getPermintaanPinjamanFunction, CSVDownloadFunction, confirmDisburseFunction, changeDisburseDateFunction } from './saga';
import 'moment/locale/id'
import { getTokenClient, getTokenAuth } from '../index/token';
import {checkPermission} from '../global/globalFunction'
import './../../support/css/table.css'
import TableComponent from '../subComponent/TableComponent'
import { Button } from '@material-ui/core';
import { constructDataLoan } from './function';

const columnDataUser = [
  {
      id: 'id',
      label: 'ID Pinjaman',
  },
  {
      id: 'borrower_name',
      label: 'Nama Nasabah',
  },
  {
      id: 'service',
      label: 'Layanan',
  },
  {
    id: 'product',
    label: 'Produk',
  },
  {
    id: 'created_at',
    label: 'Tanggal Pengajuan',
    type:'datetime'
  },
  {
    id: 'approval_date',
    label: 'Tanggal Penerimaan',
    type:'datetime'
  },
  {
    id: 'disburse_date',
    label: 'Tanggal Pencairan',
    type:'datetime'
  },
  {
    id: 'Konfirmasi',
    type: 'button',
    conditions: {
      disburse_status : 'processing',
      status : 'approved',
      disburse_date: '<date',
    },
    function: '',
    permission: '',
    label: 'Telah Dicairkan',
  },
  {
    id: 'Ubah',
    type: 'button',
    conditions: {
      disburse_date_changed : false,
      disburse_status : 'processing',
    },
    label: 'Ubah Tanggal Pencairan',
    permission: '',
    function: '',
  },

]

class PinjamanList extends React.Component {
  _isMounted = false;

  state = {
    checkedData:[],
    rows: [],
    page: 1,
    paging:true,
    rowsPerPage: 10,
    startDate: new Date() ,
    endDate: new Date(),
    downloadDataCSV: [],
    downloadModal:false,
    headerCsv: [],
    reportNameCsv: '',
    total_data:0,
    loading:true,
    loadingBtn:false,
    searching:false,
    errorMessage:'',
    modal:false,
    idPinjaman:null,
    ubahTanggalPencairan:new Date(),
    disburse:false,
    telahDicairkan:'Dikonfirmasi',
    statusTanggalDisburse:'Diubah'
  };

  componentDidMount(){
    this._isMounted=true;
    this._isMounted && this.getAllData();

    columnDataUser[7].function = this.btnKonfirmasi;
    if(checkPermission('lender_loan_confirm_disburse')) {
      columnDataUser[7].permission = true;
    }
    
    columnDataUser[8].function = this.toggleChangeDisburseDate;
    if(checkPermission('lender_loan_change_disburse_date')) {
      columnDataUser[8].permission = true;
    }
  }

  componentWillUnmount(){
    this._isMounted=false
  }

  getAllData = async function (){
    const param ={
      rows:"10",
      status:'approved',
      disburse_status: 'processing',
      page: this.state.page,
    }
    if(this.state.searching){
      param.start_approval_date = this.formatSearchingDate(this.state.startDate);
      param.end_approval_date = this.formatSearchingDate(this.state.endDate, true);
    }


    const data = await getPermintaanPinjamanFunction(param)
    if(data){
      if(!data.error){
        const dataLoan = (data.loanRequest && data.loanRequest.data) || [];

        this._isMounted && this.setState({
          loading:false,
          rows:dataLoan,
          total_data:(data.loanRequest && data.loanRequest.total_data) || 0,
        })        
      }else{
        this._isMounted && this.setState({errorMessage:data.error})
      }
    }
  }

  //UNTUK TANGGAL 
  handleStartChange = (date)=> {
    this.setState({
      startDate: date
    });
  }

  handleEndChange = (date)=> {
    this.setState({
      endDate: date
    });
  }

  formatSearchingDate = (dateData, endSearch) => {
    const startDate = dateData || new Date();

    let startMonth =''+ (startDate.getMonth()+1),
    startDay = '' + startDate.getDate(),
    startYear = startDate.getFullYear();

    if (startMonth.length < 2) startMonth = '0' + startMonth;
    if (startDay.length < 2) startDay = '0' + startDay;

    let newFormatStartDate = startYear+"-"+startMonth+"-"+startDay;
    newFormatStartDate += endSearch ? "T23:59:59.999Z" : "T00:00:00.000Z"

    return newFormatStartDate;
  }
  
  onBtnSearch = ()=>{
    this.setState({loading:true,searchModal:true,searching:true, checkedData:[]})
    
      if(this.state.endDate.getTime() < this.state.startDate.getTime() ){
        alert("Please input correct month range")
        this.setState({loading:false})
      } else{
        this.setState({page:1},()=>{
            this.getAllData()
        })
      }
  }

  onBtnReset =()=>{
    this.setState({loading:true,searching:false,page:1},()=>{
      this.getAllData()

    })

  }

//BUAT DOWNLOAD CSV
  

  btnDownloadCsv = ()=>{
    this.setState({loadingBtn:true})

    const arr = this.state.checkedData;
  
    if (arr.length===0){
      swal("Info","Silahkan Pilih Data yang ingin di download","info")
      this.setState({loadingBtn:false})
    }else{
      var id=[];

      for (var j=0;j<arr.length;j++){
        id.push(arr[j])
      }

      const param = {
        id: id.toString(),
        status:'approved',
        disburse_status: 'processing',
      }

      if(param.id === 'all') {
        delete param.id;
      }

      if(this.state.searching) {
        param.start_approval_date = this.formatSearchingDate(this.state.startDate);
        param.end_approval_date = this.formatSearchingDate(this.state.endDate, true);
      }

      this.btnCSVDownload(param)

    }    
  }

  btnCSVDownload = async function (param){
    this.setState({loading:true});

    const data = await CSVDownloadFunction(param)

    if(data){
      
      if(!data.error){
        let dataCsv = constructDataLoan(data.data, 'Disetujui') || [];

        this.setState({loading:false,loadingBtn:false,downloadModal:true,downloadDataCSV:dataCsv && dataCsv.data, headerCsv: dataCsv && dataCsv.header, reportNameCsv: dataCsv && dataCsv.name})
      } else{
        this.setState({loading:false,loadingBtn:false,downloadModal:false,errorMessage:data.error})
      }
    }
  }

  onChangePage = (current) => {
    this.setState({loading:true,page:current},()=>{
        this.getAllData()
    })
  }

  btnKonfirmasi = (e ,id)=>{
    this.confirmDisburse({id})
  } 

  confirmDisburse = async function (param){
    const data = await confirmDisburseFunction (param)

    if(data){
      if(!data.error){
          this.setState({telahDicairkan:'Dikonfirmasi'}, () => { this.getAllData()})
          swal("Success","Dana telah dicairkan","success")
      }else{
          swal("Fail","Konfirmasi Gagal","error")
      }
    }
  }

  handleTanggalPencairan =(e)=>{
    this.setState({ubahTanggalPencairan:e})
  }
  
  toggleChangeDisburseDate = (e, id) => {
    
    this.setState({modal: true, idPinjaman: id});
  }
  
  handleCheckBox =(e)=>{
    let checkedData = this.state.checkedData;
    if(e.target.checked){
      if(e.target.value.toString() === 'all') {
        checkedData = ['all']
      } else {
        checkedData.push(parseInt(e.target.value))
      }
    }else{
      checkedData.splice(checkedData.indexOf(parseInt(e.target.value)),1)
    }

    this.setState({checkedData});
    
  }

  ubahTanggalPencairanBtn = ()=>{
    this.setState({disburse:true})
    const {ubahTanggalPencairan,idPinjaman} = this.state

    let startMonth =''+ (ubahTanggalPencairan.getMonth()+1),
    startDay = '' + ubahTanggalPencairan.getDate(),
    startYear = ubahTanggalPencairan.getFullYear();

    if (startMonth.length < 2) startMonth = '0' + startMonth;
    if (startDay.length < 2) startDay = '0' + startDay;

    const changeDate = startYear+"-"+startMonth+"-"+startDay
    const param ={
      id:idPinjaman,
      date:changeDate
    }
    
    this.disburseDate(param)
  }

  disburseDate = async function (param){
    const data = await changeDisburseDateFunction(param)

    if(data){
      if(!data.error){
        swal("Success","Tanggal pencairan berhasil diubah","success")
        this.setState({modal:false,disburse:false,statusTanggalDisburse:'Diubah'},()=>{
          this.getAllData()
        })
      }else{
        swal("Fail","Tanggal pencairan gagal diubah","error")
        this.setState({disburse:false})

      }
    }
  } 

  //FUNCTION BUAT MODAL
 
  btnCancelModalDownload = ()=>{
    this.setState({downloadModal:false,downloadDataCSV:[],searchModal:false})
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
      this.setState({checkedData: []})
  }

  renderBtnOrLoading =()=>{
    if (this.state.loadingBtn){
        return  <Loader 
        type="ThreeDots"
        color="#00BFFF"
        height="30"	
        width="30"
        
     />   
    }
    else{
        return(
          <input type="button" className="btn btn-primary ml-3" onClick={this.btnDownloadCsv} value="CSV Download"></input>
        )
    }
  }

  renderBtnDisburseDate =()=>{
    if(this.state.disburse){
      return(
      <Button disableElevation color="primary" onClick={this.ubahTanggalPencairanBtn}>   
        <Loader 
          type="ThreeDots"
          color="#00BFFF"
          height="30"	
          width="30"
        />       
      </Button>  
      )
    }else{
      return(
        <Button disableElevation color="primary" onClick={this.ubahTanggalPencairanBtn}><b>Simpan</b></Button>    

      )
    }
  }
    
  render() {
    if(getTokenClient() && getTokenAuth()){
      
      return (
        <div style={{padding:0}}>

        <Modal isOpen={this.state.downloadModal} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Jumlah Download CSV: {this.state.checkedData && this.state.checkedData[0] && this.state.checkedData[0] === 'all' ? this.state.total_data : this.state.checkedData.length} item(s)</ModalHeader>
          <ModalBody>
          <CSVLink 
            headers={this.state.headerCsv}
            data={this.state.downloadDataCSV} 
            filename={this.state.reportNameCsv}
          > 
            Click Here to Download CSV 
          </CSVLink>
          </ModalBody>
          <ModalFooter>
            <Button disableElevation color="secondary" onClick={this.btnCancelModalDownload}><b>Close</b></Button>
          </ModalFooter>
        </Modal>
      
        <Modal isOpen={this.state.modal} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Ubah Tanggal Pencairan</ModalHeader>
          <ModalBody>

            <DatePicker
              className="ml-3"
              format="yyyy-MM-dd"
              onChange={this.handleTanggalPencairan}
              value={this.state.ubahTanggalPencairan}
              clearIcon={null}
            /> 
            
                  
            
          </ModalBody>
          <ModalFooter>

            { this.renderBtnDisburseDate()}
            <Button disableElevation color="secondary" onClick={()=>this.setState({modal:false})}><b>Tutup</b></Button>
          </ModalFooter>
        </Modal>

       
          < TableComponent
            id={"id"}
            title={'Pinjaman Disetujui - List'}
            errorMessage={this.state.errorMessage}
            checkBoxAction={this.handleCheckBox}
            searchDate={
              {
                value:[this.state.startDate, this.state.endDate],
                label: 'Tanggal Penerimaan',
                function: [this.handleStartChange, this.handleEndChange],
                button: [
                  {
                    label:'Cari',
                    color:'#20B889',
                    function:this.onBtnSearch
                  },
                  {
                    label:'Reset',
                    color:'#EE6969',
                    function:this.onBtnReset
                  },
                ]
              }
            }
            arrayCheckBox={this.state.checkedData}
            paging={this.state.paging}
            loading={this.state.loading}
            columnData={columnDataUser}
            data={this.state.rows}
            page={this.state.page}
            rowsPerPage={this.state.rowsPerPage}
            totalData={this.state.total_data}
            onChangePage={this.onChangePage}     
            button={
              [
                {
                  label:'Download CSV',
                  color: '#20B889',
                  function:this.btnDownloadCsv
                },
              ]
            }        
            permissionDetail={ checkPermission('lender_loan_request_detail') ? '/pinjamanDetail/' : null}
          /> 
        
        </div>
      );
    } else if (getTokenAuth()){
      return  <Redirect to='/login' />
    }
  }
}

const mapStateToProp = (state)=>{
  return{
      role: state.user.role,
      id: state.user.id
  }
}
export default connect (mapStateToProp)(PinjamanList) ;
