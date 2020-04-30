import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert';
import { getPermintaanPinjamanDetailFunction, patchInstallmentFunction, patchLoanFunction, patchInstallmentBulkFunction } from './saga';
import Loading from '../subComponent/Loading';
import { checkPermission, handleFormatDate, findAmount, formatMoney, decryptImage, formatNumber } from '../global/globalFunction'
import { getTokenAuth, getTokenClient } from '../index/token';
import GridDetail from '../subComponent/GridDetail'
import TitleBar from '../subComponent/TitleBar';
import { Grid } from '@material-ui/core';
import ActionComponent from '../subComponent/ActionComponent';
import DialogComponent from '../subComponent/DialogComponent';
import TableComponent from '../subComponent/TableComponent';

const columnDataUser = [
    {
        id: 'id',
        label: 'ID Pinjaman',
        hidden: true,
    },
    {
        id: 'period',
        label: 'Period',
    },
    {
        id: 'due_date',
        label: 'Tanggal Jatuh Tempo',
        type:'datetime'
    },
    {
        id: 'total',
        label: 'Total Cicilan',
    },
    {
        id: 'paid_amount_string',
        label: 'Total Pembayaran',
    },
    {
        id: 'paid_date',
        label: 'Tanggal Pembayaran',
        type:'datetime'
    },
    {
        id: 'paid_status_string',
        label: 'Status',
    },
  
]

class Main extends React.Component{
    _isMounted=false

    state = {
        errorMessage:'',
        endDate:null,
        diterima:false,
        dicairkan: false,
        dipinjam:false,
        ditolak:false,
        loading:true,
        dateApprove:null,
        reason:'',
        dialog: false,
        statusPinjaman: '',
        status:'',
        disburse_status: '',
        payment_status: '',
        paymentNote: '',
        paymentStatus: '',
        title:'',
        rowsPerPage: 12,
        page: 1,
        totalData: 0,
        paging: true,
        loadingPage: false,
        permissionPaidInstallment: false,
        dataListPaid: [
            {
                id: 'processing',
                label: 'Dalam Proses'
            },
            {
                id: 'paid',
                label: 'Telah Lunas'
            },
            {
                id: 'failed',
                label: 'Gagal Bayar'
            },
        ]
    }

    componentDidMount(){
        this._isMounted=true
        this.getDataDetail()
    }

    componentWillUnmount(){
        this._isMounted=false
    }

    getDataDetail =()=>{
        this._isMounted && this.refresh()
    }

    permissionBtnPaid = () => {
        let flag = false;

        if(
            checkPermission('lender_loan_installment_approve') &&
            this.state.status && this.state.status === 'approved' &&
            this.state.disburse_status && this.state.disburse_status === 'confirmed' &&
            this.state.payment_status && this.state.payment_status === 'processing'
        ) {
            flag = true;
        }

        return flag
    }

    refresh = async function(status){
        const param = {}
        param.idLoan = this.props.match.params.idLoan 

        if(status) {
            if(status === 'terima') {
                param.dateApprove = this.state.dateApprove
            } else if(status === 'tolak') {
                param.reason = this.state.reason
            }
        }

        const data = await getPermintaanPinjamanDetailFunction (param,status)

        if(data){
            if(!data.error){
                if(status && status === 'terima'){
                    swal("Permintaan Pinjaman","Diterima","success")
                    this._isMounted && this.setState({errorMessage:'',diterima:true, loading:false})
                } else if(status && status === 'tolak'){
                    swal("Permintaan Pinjaman","Ditolak","warning")
                    this._isMounted && this.setState({errorMessage:'',ditolak:true , loading:false})
                } else {                 
                    const rows = data.dataLender;

                    
                    const pinjamanInfo = this.getPinjamanInfo(rows);
                    const detailInfo = this.getDetailInfo(rows);
                    const feesInfo = this.getFeesInfo(data.dataLender && data.dataLender.fees, rows && rows.loan_amount)
                    const formInfo = this.getFormInfo(data.dataLender && data.dataLender.form_info && (typeof(data.dataLender.form_info) !== 'object' ? JSON.parse(data.dataLender.form_info) : data.dataLender.form_info))
                    const borrowerInfo = this.getBorrowerInfo(data.dataLender && data.dataLender.borrower_info);                 
                    const allInstallment = data.dataLender && data.dataLender.installment_details;

                    if(checkPermission('lender_loan_request_list_installment_list')) {
                        this.getInstallmentInfo(data.dataLender.installment_details);
                    }
                    
                    this.setState({
                        pinjamanInfo,
                        formInfo,
                        feesInfo,
                        borrowerInfo,
                        detailInfo,
                        allInstallment,
                        status: rows && rows.status,
                        disburse_status: rows && rows.disburse_status,
                        payment_status: rows && rows.payment_status,
                        paymentStatus: rows && rows.payment_status,
                        paymentNote: rows && rows.payment_note,
                        loading:false,
                        loadingPage: false,
                    }, () => {
                        if(status && status === 'paid') {
                            swal("Perubahan Detail Cicilan","Berhasil","success")
                        } else if(status && status === 'paidLoan') {
                            swal("Status Pinjaman diubah","Berhasil","success")
                        }
                    })
                    
                }
                
            }else{
                this.setState({errorMessage:data.error, loading:false, loadingPage: false,})
            }
        }
    }

    getInstallmentInfo = (installmentParam) => {
        const installment = installmentParam || this.state.allInstallment;
        const installmentInfo = [];
        const page = this.state.page;
        const rowsPerPage = this.state.rowsPerPage;
        let totalData = 0;
        
        if(installment) {
            for(const key in installment) {
                if(parseInt(key) >= (rowsPerPage * (page-1)) && parseInt(key) < (rowsPerPage * page)) {
                    const newInstallment = installment[key];

                    newInstallment.paid_status_string = newInstallment.paid_status ? 'Sudah Bayar' : 'Belum Bayar';
                    newInstallment.paid_amount_string = formatMoney(parseInt(newInstallment.paid_amount || 0))
                    newInstallment.total = formatMoney(parseInt(newInstallment.loan_payment + newInstallment.interest_payment + newInstallment.penalty))
                    installmentInfo.push(installment[key])
                }
                totalData += 1;
            }
        }
        
        this.setState({totalData, loadingPage: false, installmentInfo})
        
    }

    getDetailInfo = (rows) => {
        let pinjamanInfo = null;

        if(rows) {
            pinjamanInfo = {
                title: [
                    ['ID Pinjaman','Nasabah', 'Rekening'],
                    ['Status Pinjaman','Kategori', 'Agen/ AE'],
                ],
                value: [
                    [
                        rows.id,
                        `${rows.borrower_name || '-'} ( ${rows.borrower || '-'} )`,
                        rows.bank_account,
                    ],
                    [
                        rows.status &&   rows.status === "processing" ? {value:"Dalam Proses", color:'blue'} : 
                        rows.status === "approved" && rows.disburse_status ==="confirmed" ? {value:"Telah Dicairkan", color:'blue'} :
                        rows.status ==='rejected'? {value:"Ditolak", color:'red'} :
                        rows.status === 'approved'? {value:"Diterima", color:'green'} : null,
                        rows.category === ""? "Personal":
                        rows.category==="account_executive"?"Account Executive":"Agent",
                        `${rows.agent_name?rows.agent_name:"-"} (${rows.agent_provider_name?rows.agent_provider_name:"-"})`
                    ],
                ],
            }

            if(rows.status === 'approved' && rows.disburse_status === 'confirmed') {
                pinjamanInfo.title[0].push('Status Pembayaran')
                pinjamanInfo.value[0].push(rows.payment_status && (rows.payment_status === 'processing' ? {value:"Dalam Proses", color:'blue'}  : rows.payment_status === 'paid' ? {value:"Telah Lunas", color:'green'}  : rows.payment_status === 'failed' ? {value:"Gagal Bayar", color:'red'} : '-'))
                pinjamanInfo.title[1].push('Catatan Pembayaran')
                pinjamanInfo.value[1].push(rows.payment_note)
            }
        }
        

        return pinjamanInfo;
    }

    getBorrowerInfo = (borrower) => {
        let borrowerInfo = null;

        if(borrower) {
            borrowerInfo = {
                title: [
                    ['Tanggal lahir','Nomor Telepon', 'Nomor KTP', 'Nomor NPWP'],
                    ['Pendapatan', 'Sumber Pendapatan', 'Pendapatan Lainnya','Sumber Pendapatan Lainnya'],
                ],
                value: [
                    [handleFormatDate(borrower.birthday), borrower.phone, borrower.idcard_number, borrower.taxid_number ],
                    [formatMoney(borrower.monthly_income), borrower.occupation, formatMoney(borrower.other_income), borrower.other_incomesource]
                ],
            }
        }

        return borrowerInfo;
    }

    getPinjamanInfo = (rows) => {
        let pinjamanInfo = null;

        if(rows) {
            pinjamanInfo = {
                title: [
                    ['Total Pinjaman','Pinjaman Pokok', 'Tenor'],
                    ['Produk', 'Bunga', 'Tujuan Pinjaman','Keterangan'],
                    ['Tanggal Pengajuan']
                ],
                value: [
                    [formatMoney(rows.total_loan),formatMoney(rows.loan_amount), rows.installment],
                    [rows.product,`${rows.interest}%`, rows.loan_intention, rows.intention_details],
                    [handleFormatDate(rows.created_at)]
                ],
            }
    
            if(rows.status === 'approved') {
                pinjamanInfo.title[0].push('Total Pencairan')
                pinjamanInfo.value[0].push(formatMoney(rows.disburse_amount))
                pinjamanInfo.title[2].push('Tanggal Penerimaan')
                pinjamanInfo.value[2].push(handleFormatDate(rows.approval_date))
                pinjamanInfo.title[2].push('Tanggal Pencairan')
                pinjamanInfo.value[2].push(`${handleFormatDate(rows.disburse_date)} ${rows.disburse_date_changed ? '(Telah Diubah)' : ''}`)
            } else if(rows.status === 'rejected') {
                pinjamanInfo.title[2].push('Tanggal Penolakan')
                pinjamanInfo.value[2].push(handleFormatDate(rows.approval_date))
                pinjamanInfo.title[2].push('Alasan Penolakan')
                pinjamanInfo.value[2].push(rows.reject_reason)
            }
        }
        

        return pinjamanInfo;
    }

    getFeesInfo = (fees, loanAmount) => {
        let feesInfo = null
        
        if(fees) {
            feesInfo = {
                title: [],
                value: [],
            }

            let arrayFee = 0;

            for(const key in fees) {
                if(arrayFee === 2) {
                    arrayFee = 0;
                }

                if(!feesInfo.title[arrayFee]) {
                    feesInfo.title[arrayFee] = []
                };
                feesInfo.title[arrayFee].push(fees[key].description)

                if(!feesInfo.value[arrayFee]) {
                    feesInfo.value[arrayFee] = []
                };
                feesInfo.value[arrayFee].push(findAmount(fees[key] && fees[key].amount, loanAmount))

                arrayFee += 1;
            }
        }

        return feesInfo;
    }

    getFormInfo = (form) => {
        let formInfo = null;
        
        if(form) { 
            formInfo = {
                title: [],
                value: [],
            }

            let arrayForm = 0;

            for(const key in form) {
                if(arrayForm === 3) {
                    arrayForm = 0
                }

                if(!formInfo.title[arrayForm]) {
                    formInfo.title[arrayForm] = []
                };
                formInfo.title[arrayForm].push(form[key].label)

                if(!formInfo.value[arrayForm]) {
                    formInfo.value[arrayForm] = []
                };

                if(form[key].type === 'image') {
                    formInfo.value[arrayForm].push({
                        type:'image',
                        value: form[key].answers && decryptImage(form[key].answers),
                    })
                } else {
                    formInfo.value[arrayForm].push(form[key].answers)
                }

                arrayForm += 1;
            }
        }
        
        return formInfo;
    }
    
    btnTerimaPinjaman = ()=>{
        const {endDate} = this.state;
        
        if (endDate === null || (endDate && endDate.toString() === 'Invalid Date')){
            this.setState({errorMessage:"Harap Masukkan Tanggal Pencairan dengan benar"})
        }else{
            this.setState({dateApprove: this.constructDate(endDate), loading: true},()=>{
                this.refresh('terima')
            });
        }
    }

    btnTolakPinjaman = ()=>{
        const reject = this.state.reason

        if(!reject || reject.trim()===''){
            this.setState({errorMessage:"Alasan Penolakan Kosong - Harap Cek Ulang"})
        }else{
            this.setState({loading: true})
            this.refresh('tolak')
        }
      
    }

    btnPaidInstallment = () => {
        this.setState({loading: true}, () => {
            this.patchInstallment()
        });
    }

    patchInstallment = async function() {
        const dataDetail = this.state.detailPaid;

        const param = {
            idLoan: this.props.match.params.idLoan,
            idInstallment: dataDetail && dataDetail.id,
            newData : {
                paid_status: dataDetail && dataDetail.paid_status,
                paid_amount: parseFloat((dataDetail && dataDetail.paid_amount) || 0),
                underpayment: dataDetail && dataDetail.paid_amount && dataDetail.loan_payment && dataDetail.interest_payment && dataDetail.penalty &&
                parseFloat((dataDetail.loan_payment + dataDetail.interest_payment + dataDetail.penalty - dataDetail.paid_amount) || 0),
                penalty: parseFloat((dataDetail && dataDetail.penalty) || 0),
                due_date: dataDetail && dataDetail.due_date && this.constructDate(dataDetail.due_date),
                note: dataDetail && dataDetail.note
            }
            
        }

        const data = await patchInstallmentFunction(param);

        if(data) {
            if(!data.error) {
                this.refresh('paid')
            } else {
                this.setState({errorMessage:data.error, loading:false, loadingPage: false,})
            }
        }
    }

    btnPaidAll = () => {
        this.setState({loading: true}, () => {
            this.patchLoan()
        });
    }

    patchLoan = async function() {
        const param = {
            idLoan: this.props.match.params.idLoan,
            newData : {
                payment_status: this.state.paymentStatus,
                payment_note: this.state.paymentNote,
            }
            
        }

        const data = await patchLoanFunction(param);

        if(data) {
            if(!data.error) {
                this.refresh('paidLoan')
            } else {
                this.setState({errorMessage:data.error, loading:false, loadingPage: false,})
            }
        }
    }

    patchInstallmentBulk = async function() {
        this.setState({loading: true})
        const param = {
            idLoan: this.props.match.params.idLoan,
            newData: [],
        }

        const allInstallment = this.state.allInstallment;

        for(const key in allInstallment) {
            if(!allInstallment[key].paid_status || (allInstallment[key].paid_status && allInstallment[key].paid_status === false)) {
                param.newData.push(
                    {
                        id: allInstallment[key].id,
                        paid_status: true,
                        paid_amount: allInstallment[key].loan_payment + allInstallment[key].interest_payment + allInstallment[key].penalty,
                        underpayment: allInstallment[key].underpayment,
                        penalty: allInstallment[key].penalty,
                        due_date: this.constructDate(allInstallment[key].due_date),
                        note: allInstallment[key].note,
                    }
                )
            }
        }
        

        const data = await patchInstallmentBulkFunction(param);

        if(data) {
            if(!data.error) {
                this.patchLoan()
            } else {
                this.setState({errorMessage:data.error, loading:false, loadingPage: false})
            }
        }
    }


    btnBack = ()=>{
        if(this.state.status === 'processing') {
            this.setState({dipinjam: true})
        } else if(this.state.status === 'approved' && this.state.disburse_status === 'confirmed') {
            this.setState({dicairkan: true})
        } else if(this.state.status === 'approved' && this.state.disburse_status === 'processing') {
            this.setState({diterima: true})
        } else if(this.state.status === 'rejected') {
            this.setState({ditolak: true})
        } else {
            window.history.back()
        }
        
    }

    handleEndChange = (date)=> {
        this.setState({
          endDate: date
        },() => {
            this.settingMessage()
        });
    }

    onChangeTextField = (e, labelData, number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }
        
        this.setState({[labelData]:dataText}, () => {          
            this.settingMessage()            
        })
    }

    onChangeTextFieldForm = (e, labelData, number, dateParam) => {
        let detailPaid = this.state.detailPaid;
        
        if(dateParam) {
            detailPaid[labelData] = e
        } else {
            if(!number || (number && !isNaN(e.target.value))) {           
                detailPaid[labelData] = e.target.value         
            }             
        }
        
        this.setState({detailPaid}, () => {
            this.settingMessage()
        })
    }
    
    onChangeCheckbox = (e, labelData) => {
        let detailPaid = this.state.detailPaid;

        detailPaid[labelData] = !detailPaid[labelData];

        this.setState({detailPaid}, () => {
            this.settingMessage();
        })
    }

    onChangeDropDown = (e, labelData) => {
        this.setState({[labelData]:e.target.value}, () => {
            this.settingMessage()
        })
    }

    btnPaidAndDetail = (e, idPaid) => {
        const newPaid = this.state.allInstallment;
            
        let detailPaid = this.state.detailPaid;
        
        if(idPaid) {
            for(const key in newPaid) {
                if(newPaid[key].id.toString() === idPaid.toString()) {
                    detailPaid = newPaid[key];
                    break;
                }
            }

            
        }

        this.setState({detailPaid}, () => {
            this.btnConfirmationDialog(e, false, 'paidInstallment')
        })
    }

    constructDate = (date) => {
        let newDate = date;

        if(typeof(date) === 'object') {
            newDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}`: date.getMonth() + 1}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`
        } 

        return newDate;
    }

    settingMessage = (statusPinjamanParam) => {
        let message = this.state.message;
        let title = this.state.title;
        let permissionPaidInstallment = this.state.permissionPaidInstallment;
        let statusPinjaman = statusPinjamanParam || this.state.statusPinjaman;

        if(statusPinjaman && statusPinjaman === 'terima') {
            title = 'Persetujuan Pinjaman';
            message = [
                {
                    id: 'endDate',
                    title: 'Mohon isi Tanggal Pencairan',
                    type:'date',
                    value:this.state.endDate,
                    function:this.handleEndChange,
                }
            ]
            permissionPaidInstallment = false;
        } else if(statusPinjaman && statusPinjaman === 'tolak') {
            title = 'Penolakan Pinjaman'
            message = [
                {
                    id: 'reason',
                    title: 'Mohon isi Alasan Penolakan',
                    type: 'textfield',
                    value: this.state.reason,
                    function: this.onChangeTextField,
                }
            ]
            permissionPaidInstallment = false;
        } else if(statusPinjaman && statusPinjaman === 'paidInstallment') {
            title = 'Pembayaran Cicilan'          
            let detailPaid = this.state.detailPaid;

            if(detailPaid) {

                permissionPaidInstallment =  detailPaid.paid_status_string === 'Sudah Bayar' || !this.permissionBtnPaid(); 
                
                message = [
                    {
                        id: 'period',
                        title: 'Period',
                        type: 'textfield',
                        value: detailPaid.period || 0,
                        disabled: true,
                    },
                    {
                        id: 'due_date',
                        title: 'Tanggal Jatuh Tempo',
                        type: 'date',
                        value: detailPaid.due_date || '',
                        function: this.onChangeTextFieldForm,
                        disabled: permissionPaidInstallment
                    },
                    {
                        id: 'loan_payment',
                        title: 'Cicilan Pokok',
                        type: 'textfield',
                        value: formatNumber(detailPaid.loan_payment) || 0,
                        disabled: true,
                    },
                    {
                        id: 'interest_payment',
                        title: 'Cicilan Bunga',
                        type: 'textfield',
                        value: formatNumber(detailPaid.interest_payment) || 0,
                        disabled: true,
                    },
                    {
                        id: 'penalty',
                        title: 'Denda',
                        type: 'textfield',
                        numeric: permissionPaidInstallment ? false : true,
                        value: permissionPaidInstallment ? formatNumber(detailPaid.penalty) : detailPaid.penalty,
                        function: this.onChangeTextFieldForm,
                        disabled: permissionPaidInstallment
                    },
                    {
                        id: 'total',
                        title: 'Total harus Bayar',
                        type: 'textfield',
                        value: formatNumber(parseFloat(detailPaid.penalty || 0) + parseFloat(detailPaid.interest_payment) + parseFloat(detailPaid.loan_payment)),
                        function: this.onChangeTextFieldForm,
                        disabled: true
                    },
                    {
                        id: 'paid_amount',
                        title: 'Total Pembayaran',
                        type: 'textfield',
                        numeric: permissionPaidInstallment ? false : true,
                        value: permissionPaidInstallment ? formatNumber(detailPaid.paid_amount) : detailPaid.paid_amount,
                        function: this.onChangeTextFieldForm,
                        disabled: permissionPaidInstallment
                    },
                    {
                        id: 'paid_date',
                        title: 'Tanggal Pembayaran',
                        type: 'textfield',
                        value: handleFormatDate(detailPaid.paid_date || ''),
                        disabled: true,
                    },
                    {
                        id: 'paid_status',
                        title: 'Status Pembayaran',
                        label: 'Terbayar',
                        type: 'checkbox',
                        value: detailPaid.paid_status || false,
                        function: this.onChangeCheckbox,
                        disabled: permissionPaidInstallment
                    },
                    {
                        id: 'note',
                        title: 'Keterangan',
                        type: 'textfield',
                        value: detailPaid.note || '',
                        function: this.onChangeTextFieldForm,
                        disabled: permissionPaidInstallment
                    }
                ]
                
            }
        } else if(statusPinjaman && statusPinjaman === 'paidAll') {
            title = 'Perubahan Status Pembayaran'
            message = [
                {
                    id: 'paymentStatus',
                    title: 'Status Pembayaran',
                    type: 'dropdown',
                    data: this.state.dataListPaid,
                    value: this.state.paymentStatus,
                    function: this.onChangeDropDown,
                },
                {
                    id: 'paymentNote',
                    title: 'Catatan Pembayaran',
                    type: 'textfield',
                    value: this.state.paymentNote,
                    function: this.onChangeTextField,
                }
            ]
            permissionPaidInstallment = false;
        }
        
        this.setState({title, message, permissionPaidInstallment: !permissionPaidInstallment})
        
    }

    btnConfirmationDialog = (e, nextStep, statusPinjaman) => {

        this.settingMessage(statusPinjaman)
        this.setState({dialog: !this.state.dialog, statusPinjaman});
  
        if(nextStep) {
            if(this.state.statusPinjaman === 'terima') {
                this.btnTerimaPinjaman()
            } else if (this.state.statusPinjaman === 'tolak') {
                this.btnTolakPinjaman()
            } else if (this.state.statusPinjaman === 'paidInstallment') {
                this.btnPaidInstallment()
            } else if (this.state.statusPinjaman === 'paidAll') {
                if(this.state.paymentStatus && this.state.paymentStatus !== 'paid') {
                    this.btnPaidAll()
                } else if(this.state.paymentStatus && this.state.paymentStatus === 'paid') {
                    this.patchInstallmentBulk()
                }
                
            }
        }
    }

    onChangePage = (current) => {
        this.setState({loadingPage:true,page:current},()=>{
            this.getInstallmentInfo(this.state.allInstallment)
        })
      }

    render(){
        if(this.state.loading){
            return(
                <Loading
                    title={'Pinjaman - Detail'}
                /> 
            )
        } else if(this.state.dipinjam){
            return (
                <Redirect to='/permintaanPinjaman' />
            )   
        } else if(this.state.dicairkan){
            return (
                <Redirect to='/pencairanList' />
            )   
        } else if(this.state.diterima){
            return (
                <Redirect to='/pinjamanSetuju' />
            )   
        } else if(this.state.ditolak){
            return (
                <Redirect to='/pinjamanTolak' />
            )   
        } else if(getTokenAuth() && getTokenClient()){
            return(
              <Grid container className="containerDetail">
                      
                <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                    
                    <TitleBar
                        title={'Pinjaman - Detail'}
                    />

                </Grid>

                <Grid
                    item
                    sm={12} xs={12}
                    style={{padding:10, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                >
                    
                    <Grid container>

                        <DialogComponent
                            title={`Konfirmasi ${this.state.title}`}
                            openDialog={this.state.dialog}
                            message={this.state.message}
                            type='form'
                            onClose={this.btnConfirmationDialog}
                            noNextStep={!this.state.permissionPaidInstallment}
                        />

                        <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                            <ActionComponent
                                permissionApprove={checkPermission("lender_loan_approve_reject") && this.state.status === 'processing' ? (e, nextStep) => this.btnConfirmationDialog(e, nextStep,'terima') : null}
                                permissionReject={checkPermission("lender_loan_approve_reject") && this.state.status === 'processing' ? (e, nextStep) => this.btnConfirmationDialog(e, nextStep, 'tolak') : null}
                                permissionPaid={checkPermission("lender_loan_patch_payment_status") && this.state.status === 'approved' && this.state.disburse_status === 'confirmed' && this.state.payment_status !== 'paid' ? (e, nextStep) => this.btnConfirmationDialog(e, nextStep, 'paidAll') : null}
                                onCancel={this.btnBack}
                            />
                        </Grid> 

                        <Grid item sm={12} xs={12} style={{color:'red'}}>
                            {this.state.errorMessage}
                        </Grid>

                        {/* Detail Pinjaman */}
                        {   this.state.detailInfo && 
                            <GridDetail
                                gridLabel={[4,5]}
                                noTitleLine
                                background
                                label={this.state.detailInfo.title}
                                data={this.state.detailInfo.value}                 
                            />
                        }
                        

                        {/* Pinjaman Section */}
                        {   this.state.pinjamanInfo &&
                            <GridDetail
                                title={'Informasi Pinjaman'}
                                gridLabel={[5,5]}
                                label={ this.state.pinjamanInfo.title }
                                data={ this.state.pinjamanInfo.value }                 
                            />
                        }

                        {/* Nasabah Section */}
                        {   this.state.borrowerInfo &&
                            <GridDetail
                                title={'Informasi Nasabah'}
                                gridLabel={[4,6]}
                                label={this.state.borrowerInfo.title}
                                data={this.state.borrowerInfo.value}                 
                            />
                        }

                        {/* Fee Section */}
                        {
                            this.state.feesInfo &&
                            <GridDetail
                                gridLabel={[4,4]}
                                title={'Informasi Biaya'}
                                label={this.state.feesInfo.title}
                                data={this.state.feesInfo.value}   
                            />
                        }
                        
                        
                        {/* Form Section */}
                        {   this.state.formInfo && 
                            <GridDetail
                                gridLabel={[4,4]}
                                title={'Informasi Form'}
                                label={this.state.formInfo.title}
                                data={this.state.formInfo.value}   
                            />
                        }

                        {   this.state.installmentInfo &&
                            <GridDetail
                                gridLabel={[4,4]}
                                title={'Informasi Cicilan'}
                                label={[]}
                                data={[]}   
                            />
                        }

                        {   this.state.installmentInfo &&
                            < TableComponent
                                id={'id'}
                                paging={this.state.paging}
                                loading={this.state.loadingPage}
                                columnData={columnDataUser}
                                data={this.state.installmentInfo}
                                page={this.state.page}
                                rowsPerPage={this.state.rowsPerPage}
                                totalData={this.state.totalData}
                                onChangePage={this.onChangePage}  
                                permissionPaid={(e, id) => this.btnPaidAndDetail(e, id)}        
                            /> 
                        }
                                

                    </Grid>
                </Grid>
            </Grid>
        )} else {
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default Main;