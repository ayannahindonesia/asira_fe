import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert';
import { getPermintaanPinjamanDetailFunction } from './saga';
import Loading from '../subComponent/Loading';
import { checkPermission, handleFormatDate, findAmount, formatMoney } from '../global/globalFunction'
import { getTokenAuth, getTokenClient } from '../index/token';
import GridDetail from '../subComponent/GridDetail'
import TitleBar from '../subComponent/TitleBar';
import { Grid } from '@material-ui/core';
import ActionComponent from '../subComponent/ActionComponent';
import DialogComponent from '../subComponent/DialogComponent';

class Main extends React.Component{
    _isMounted=false

    state = {
        errorMessage:'',
        rows:{},
        status:'',
        endDate:null,
        diterima:false,
        dicairkan: false,
        dipinjam:false,
        ditolak:false,
        productInfo:'',
        loading:true,
        dateApprove:null,
        reason:'',
        dialog: false,
        statusPinjaman: '',
        disburse_status: '',
        title:'',
    }

    componentDidMount(){
        this._isMounted=true
        this.getDataDetail()
    }

    componentWillUnmount(){
        this._isMounted=false
    }

    getDataDetail =()=>{
        this._isMounted && this.getDataDetailBtn()
    }

    getDataDetailBtn = async function(status){
        const param = {}
        param.idLoan = this.props.match.params.idLoan 
        param.idBorrower =  this.props.match.params.idBorrower

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
                if(!status) {
                    console.log(data.dataLender)
                    const rows = data.dataLender;

                    
                    const pinjamanInfo = this.getPinjamanInfo(rows);
                    const detailInfo = this.getDetailInfo(rows);
                    const feesInfo = this.getFeesInfo(data.dataLender && data.dataLender.fees, rows && rows.loan_amount)
                    const formInfo = this.getFormInfo(data.dataLender && data.dataLender.form_info)
                    const borrowerInfo = this.getBorrowerInfo(data.dataLender && data.dataLender.borrower_info)


                    this.setState({
                        rows,
                        pinjamanInfo,
                        formInfo,
                        feesInfo,
                        borrowerInfo,
                        detailInfo,
                        status:data.dataLender.status,
                        disburse_status: data.dataLender.disburse_status,
                        loading:false
                    })
                } else if(status === 'terima'){
                    swal("Permintaan","Diterima","success")
                    this._isMounted && this.setState({errorMessage:'',diterima:true, loading:false})
                } else if(status === 'tolak'){
                    swal("Permintaan","Ditolak","warning")
                    this._isMounted && this.setState({errorMessage:'',ditolak:true , loading:false})
                }
                
            }else{
                this.setState({errorMessage:data.error, loading:false})
            }
        }
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
                
                if(typeof(form[key].answers) === 'object') {
                    const answers = form[key].answers;
                    let stringAnswers = '';

                    for(const keyAnswers in answers) {
                        if(stringAnswers.length !== 0) {
                            stringAnswers += ', '
                        }
                        stringAnswers += answers[keyAnswers] 
                    }
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
            var endMonth =''+ (endDate.getMonth()+1),
            endDay = '' + endDate.getDate(),
            endYear = endDate.getFullYear();
            var newDay=''
            var newMonth=''
            if(parseInt(endDay)<10){
                newDay+= "0"+endDay
            }else{
                newDay = endDay
            }
            if(parseInt(endMonth)<10){
                newMonth+= "0"+endMonth
            }else{
                newMonth = endMonth
            }
            
            const newFormatEndDate = endYear+"-"+newMonth+"-"+newDay
            this.setState({dateApprove: newFormatEndDate, loading: true},()=>{
                this.getDataDetailBtn('terima')
            });
        }
    }

    btnTolakPinjaman = ()=>{
        const reject = this.state.reason

        if(!reject || reject.trim()===''){
            this.setState({errorMessage:"Alasan Penolakan Kosong - Harap Cek Ulang"})
        }else{
            this.setState({loading: true})
            this.getDataDetailBtn('tolak')
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
            if(labelData === 'reason') {
                this.settingMessage()
            } 
            
        })
    }

    settingMessage = (statusPinjamanParam) => {
        let message = this.state.message;
        let title = this.state.title;
        let statusPinjaman = statusPinjamanParam || this.state.statusPinjaman

        if(statusPinjaman && statusPinjaman === 'terima') {
            title = 'Persetujuan';
            message = [
                {
                    id: 'endDate',
                    title: 'Mohon isi Tanggal Pencairan',
                    type:'date',
                    value:this.state.endDate,
                    function:this.handleEndChange,
                }
            ]
        } else if(statusPinjaman && statusPinjaman === 'tolak') {
            title = 'Penolakan'
            message = [
                {
                    id: 'reason',
                    title: 'Mohon isi Alasan Penolakan',
                    type: 'textfield',
                    value: this.state.reason,
                    function: this.onChangeTextField,
                }
            ]
            
            
        }


        this.setState({title, message})
    }

    btnConfirmationDialog = (e, nextStep, statusPinjaman) => {
        
        this.settingMessage(statusPinjaman)
        this.setState({dialog: !this.state.dialog, statusPinjaman});
  
        if(nextStep) {
            if(this.state.statusPinjaman === 'terima') {
                this.btnTerimaPinjaman()
            } else if (this.state.statusPinjaman === 'tolak') {
                this.btnTolakPinjaman()
            }
        }
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
                <Redirect to='/pencairanList' />
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
                        />

                        <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                            <ActionComponent
                                permissionApprove={checkPermission("lender_loan_approve_reject") && this.state.status === 'processing' ? (e, nextStep) => this.btnConfirmationDialog(e, nextStep,'terima') : null}
                                permissionReject={checkPermission("lender_loan_approve_reject") && this.state.status === 'processing' ? (e, nextStep) => this.btnConfirmationDialog(e, nextStep, 'tolak') : null}
                                onCancel={this.btnBack}
                            />
                        </Grid> 

                        <Grid item sm={12} xs={12} style={{color:'red'}}>
                            {this.state.errorMessage}
                        </Grid>

                        {/* Detail Pinjaman */}
                        {   this.state.detailInfo && 
                            <GridDetail
                                gridLabel={[4,4]}
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