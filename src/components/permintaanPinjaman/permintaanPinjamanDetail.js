import React from 'react'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert';
import { getPermintaanPinjamanDetailFunction } from './saga';
import Loading from '../subComponent/Loading';
import { checkPermission, handleFormatDate, findAmount, formatMoney } from './../global/globalFunction'
import { getTokenAuth, getTokenClient } from '../index/token';
import GridDetail from './../subComponent/GridDetail'
import TitleBar from '../subComponent/TitleBar';
import { Grid } from '@material-ui/core';
import ActionComponent from '../subComponent/ActionComponent';
import DialogComponent from '../subComponent/DialogComponent';

class Main extends React.Component{
    _isMounted=false

    state = {
        errorMessage:'',
        rows:{},
        borrowerDetail:{},
        status:'',
        endDate:null,
        diterima:false,
        ditolak:false,
        productInfo:'',
        loading:true,
        dateApprove:null,
        reason:'',
        dialog: false,
        statusPinjaman: '',
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
                    const feesInfo = this.getFeesInfo(data.dataLender && data.dataLender.fees, rows && rows.loan_amount)
                    const formInfo = this.getFormInfo(data.dataLender && data.dataLender.form_info)


                    this.setState({
                        rows,
                        pinjamanInfo,
                        formInfo,
                        feesInfo,
                        status:data.dataLender.status,
                        borrowerDetail:data.dataLender.borrower_info,
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

    getPinjamanInfo = (rows) => {
        let pinjamanInfo = {};

        if(rows) {
            pinjamanInfo = {
                title: [
                    ['Total Pinjaman','Pinjaman Pokok', 'Bunga'],
                    ['Tenor', 'Tujuan Pinjaman','Keterangan'],
                    ['Tanggal Pengajuan']
                ],
                value: [
                    [formatMoney(rows.total_loan),formatMoney(rows.loan_amount),`${rows.interest}%`],
                    [rows.installment, rows.loan_intention, rows.intention_details],
                    [handleFormatDate(rows.created_at)]
                ],
            }
    
            if(rows.status === 'approved') {
                pinjamanInfo.title[1].push('Total Pencairan')
                pinjamanInfo.value[1].push(formatMoney(rows.disburse_amount))
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
        let feesInfo = {}
        
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
        let formInfo = {};

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
                        console.log(isNaN(keyAnswers))
                        if(!isNaN(keyAnswers)) {
                            console.log(answers[keyAnswers])
                            console.log(keyAnswers)
                            stringAnswers += answers[keyAnswers] ? keyAnswers : ''
                        } else {
                            stringAnswers += answers[keyAnswers] 
                        }
                        
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
        window.history.back()
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
                    title: 'Tanggal Pencairan',
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
                    title: 'Alasan Penolakan',
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
        }
        if(this.state.diterima){
            return (
                <Redirect to='/pinjamanSetuju' />
            )   
        }
        
        if(this.state.ditolak){
            return (
                <Redirect to='/pinjamanTolak' />
            )   
        }
        if(getTokenAuth() && getTokenClient()){
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
                        <GridDetail
                            gridLabel={[5,5,3]}
                            noTitleLine
                            background
                            label={[
                                ['ID Pinjaman','Nama Nasabah'],
                                ['Rekening Pinjaman','Status Pinjaman'],
                                ['Kategori', 'Agen/ AE'],
                            ]}
                            data={this.state.rows && [
                                [
                                this.state.rows.id,
                                this.state.rows.borrower_name
                                ],
                                [
                                this.state.rows.bank_account,
                                this.state.status &&   this.state.status === "processing"?
                                    {value:"Dalam Proses", color:'blue'}
                                    : this.state.status === "approved" && this.state.rows.disburse_status ==="confirmed"?
                                    {value:"Telah Dicairkan", color:'blue'}:
                                    this.state.status ==='rejected'?
                                    {value:"Ditolak", color:'red'}:
                                    this.state.status === 'approved'?
                                    {value:"Diterima", color:'green'}:
                                    null
                                ],
                                [
                                this.state.rows.category===""?"Personal":this.state.rows.category==="account_executive"?"Account Executive":"Agent",
                                `${this.state.rows.agent_name?this.state.rows.agent_name:"-"} (${this.state.rows.agent_provider_name?this.state.rows.agent_provider_name:"-"})`
                                ],
                            ]}                 
                        />

                        {/* Pinjaman Section */}
                        <GridDetail
                            title={'Informasi Pinjaman'}
                            gridLabel={[5,5]}
                            label={ this.state.pinjamanInfo && this.state.pinjamanInfo.title }
                            data={ this.state.pinjamanInfo && this.state.pinjamanInfo.value }                 
                        />

                        {/* Fee Section */}
                        <GridDetail
                            gridLabel={[4,4]}
                            title={'Informasi Biaya'}
                            label={this.state.feesInfo && this.state.feesInfo.title}
                            data={this.state.feesInfo && this.state.feesInfo.value}   
                        />
    
                    {/* Penghasilan Section */}
            
                        <GridDetail
                            title={'Info Penghasilan Saat Pengajuan'}
                            gridLabel={[3]}
                            label={[
                                ['Pendapatan perbulan','Penghasilan lain-lain (jika ada)','Sumber Penghasilan lain-lain']
                            ]}
                            data={this.state.rows && this.state.borrowerDetail && [
                                [
                                this.state.borrowerDetail.monthly_income?
                                formatMoney(parseInt(this.state.borrowerDetail.monthly_income))
                                :0,
                                this.state.borrowerDetail.other_income?formatMoney(parseInt(this.state.borrowerDetail.other_income)):0,
                                this.state.borrowerDetail.other_incomesource
                                ],
                                
                            ]}                 
                        />

                        
                        {/* Form Section */}
                        {this.state.formInfo && this.state.formInfo.title && this.state.formInfo.value &&
                            <GridDetail
                                gridLabel={[4,4]}
                                title={'Informasi Form'}
                                label={this.state.formInfo && this.state.formInfo.title}
                                data={this.state.formInfo && this.state.formInfo.value}   
                            />
                        }
                  

                    </Grid>
                </Grid>
            </Grid>
        )}
        if(getTokenAuth()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default Main;