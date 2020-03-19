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
import {checkPermission, formatNumber} from './../global/globalFunction'
import './../../support/css/table.css'
import TableComponent from './../subComponent/TableComponent'
import { Button } from '@material-ui/core';

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
    label: 'Tanggal Approval',
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

const headerCsv = [
  { label:'ID Pinjaman', key:'id'},
  { label:'Nama Nasabah', key:'borrower_name'},
  { label:'Bank', key:'bank_name'},
  { label:'Pinjaman Pokok', key:'loan_amount'},
  { label:'Lama Cicilan', key:'installment'},
  { label:'Admin Fee', key:'fees.admin_fee'},
  { label:'Convenience Fee', key:'fees.convenience_fee'},
  { label:'Bunga (%)', key:'interest'},
  { label:'Total Pinjaman', key:'total_loan'},
  { label:'Due Date', key:'due_date'},
  { label:'Cicilan', key:'layaway_plan'},
  { label:'Tujuan Pinjaman', key:'loan_intention'},
  { label:'Tujuan Pinjaman Detail', key:'intention_details'},
  { label:'Penghasilan Bulanan', key:'monthly_income'},
  { label:'Penghasilan Lain-lain', key:'other_income'},
  { label:'Sumber Penghasilan Lain-lain', key:'other_incomesource'},
  { label:'Rekening Bank', key:'bank_account'},
]

class PinjamanSetuju extends React.Component {
  _isMounted = false;

  state = {
    checkedData:[],
    rows: [],
    page: 1,last_page:1,
    rowsPerPage: 10,
    isEdit: false,
    editIndex:Number,
    udahdiklik : false,
    startDate: new Date() ,
    endDate: new Date(),
    downloadDataCSV: [],downloadModal:false,
    total_data:0,
    loading:true,loadingBtn:false,
    searching:false,errorMessage:'',
    modal:false,idPinjaman:null,ubahTanggalPencairan:new Date(),disburse:false,telahDicairkan:'Dikonfirmasi',statusTanggalDisburse:'Diubah'
  };

  componentDidMount(){
    this._isMounted=true;
    this._isMounted && this.getAllData();

    columnDataUser[7].function = this.btnKonfirmasi;
    columnDataUser[7].permission = this.checkPermissionConfirmDisburse;
    columnDataUser[8].function = this.toggleChangeDisburseDate;
    columnDataUser[8].permission = this.checkPermissionChangeDisburseDate;
  }


  checkPermissionChangeDisburseDate = () => {
    return checkPermission('lender_loan_change_disburse_date')
  }

  checkPermissionConfirmDisburse = () => {
    return checkPermission('lender_loan_confirm_disburse')
  }

  componentWillUnmount(){
    this._isMounted=false
  }

  getAllData = async function (){
    const param ={
      status:"approved",
      rows:"10",
      page: this.state.page,
    }
    if(this.state.searching){
      param.start_approval_date = this.formatSearchingDate(this.state.startDate);
      param.end_approval_date = this.formatSearchingDate(this.state.endDate, true);
    }


    const data = await getPermintaanPinjamanFunction(param)

    if(data){
      if(!data.error){
        this._isMounted && this.setState({loading:false,rows:data.loanRequest.data,rowsPerPage:data.loanRequest.rows,page:data.loanRequest.current_page,last_page:data.loanRequest.last_page,total_data:data.loanRequest.total_data})        
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
        status: 'approved',
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
        let dataCsv = data.data || [];
      
        if(dataCsv) {

          for(const key in dataCsv) {

            let feesData = {};

            dataCsv[key].bank_account = `'${dataCsv[key].bank_account.toString()}`;
            const loan_amount_float = dataCsv[key].loan_amount.toString().split('.')[1] && dataCsv[key].loan_amount.toString().split('.')[1].substring(0,2);
            dataCsv[key].loan_amount = `${formatNumber(parseInt(dataCsv[key].loan_amount))},${loan_amount_float || '00'}`;
            const total_loan_float = dataCsv[key].total_loan.toString().split('.')[1] && dataCsv[key].total_loan.toString().split('.')[1].substring(0,2);
            dataCsv[key].total_loan = `${formatNumber(parseInt(dataCsv[key].total_loan))},${total_loan_float || '00'}`;
            const monthly_income_float = dataCsv[key].monthly_income.toString().split('.')[1] && dataCsv[key].monthly_income.toString().split('.')[1].substring(0,2);
            dataCsv[key].monthly_income = `${formatNumber(parseInt(dataCsv[key].monthly_income))},${monthly_income_float || '00'}`;
            const layaway_plan_float = dataCsv[key].layaway_plan.toString().split('.')[1] && dataCsv[key].layaway_plan.toString().split('.')[1].substring(0,2);
            dataCsv[key].layaway_plan = `${formatNumber(parseInt(dataCsv[key].layaway_plan))},${layaway_plan_float || '00'}`;

            const fees = dataCsv[key].fees;

            for(const keyFee in fees) {
              let desc = fees[keyFee] && fees[keyFee].description && fees[keyFee].description.toString().toLowerCase();

              while(desc && desc.includes(' ')) {
                desc = desc.replace(' ','_')
              }
              
              if(!feesData[desc] && fees[keyFee] && fees[keyFee].amount) {
                feesData[desc] = '';
                const fees_float = fees[keyFee] && fees[keyFee].amount && fees[keyFee].amount.toString().split('.')[1] && fees[keyFee].amount.toString().split('.')[1].substring(0,2);        
                feesData[desc] = desc && fees[keyFee] && fees[keyFee].amount && `${formatNumber(parseInt(fees[keyFee].amount))},${fees_float || '00'}`
                
              }
            }
            
            dataCsv[key].fees = feesData;
          }

        }

        this.setState({loading:false,loadingBtn:false,downloadModal:true,downloadDataCSV:dataCsv})
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
            headers={headerCsv}
            data={this.state.downloadDataCSV} 
            filename={`Report Loan Telah Disetujui_${this.formatSearchingDate(new Date()).substring(0,10)}.csv`}
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

            {this.renderBtnDisburseDate()}
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
                label: 'Tanggal Approval',
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
export default connect (mapStateToProp)(PinjamanSetuju) ;
