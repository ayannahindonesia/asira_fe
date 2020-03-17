import React from 'react'
import { Redirect } from 'react-router-dom'
import Moment from 'react-moment'
import swal from 'sweetalert';
import { getPermintaanPinjamanDetailFunction } from './saga';
import Loading from '../subComponent/Loading';
import { checkPermission, handleFormatDate,formatNumber, findAmount } from './../global/globalFunction'
import { getTokenAuth, getTokenClient } from '../index/token';
import GridDetail from './../subComponent/GridDetail'
import TitleBar from '../subComponent/TitleBar';
import DatePicker from './../subComponent/DateTimePicker'
import { Grid, TextField } from '@material-ui/core';
import ActionComponent from '../subComponent/ActionComponent';

class Main extends React.Component{
    _isMounted=false

    state = {
        errorMessage:'',
        rows:{},
        formInfo:[],
        items:[],
        borrowerDetail:{},
        status:'',
        endDate:null,
        diterima:false,
        ditolak:false,
        productInfo:'',
        loading:true,
        dateApprove:null,
        reason:'',
    }

    formatMoney=(number)=>
    { return number.toLocaleString('in-RP', {style : 'currency', currency: 'IDR'})}

    componentDidMount(){
        this._isMounted=true
        this.getDataDetail()
    }
    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
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
                    this.setState({
                        rows:data.dataLender,
                        formInfo:data.dataLender.form_info,
                        items:data.dataLender.fees,
                        status:data.dataLender.status,
                        borrowerDetail:data.dataLender.borrower_info,
                        loading:false
                    })
                } else if(status === 'terima'){
                    swal("Permintaan","Diterima","success")
                    this._isMounted && this.setState({errorMessage:'',diterima:true})
                } else if(status === 'tolak'){
                    swal("Permintaan","Ditolak","warning")
                    this._isMounted && this.setState({errorMessage:'',ditolak:true})
                }
                
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    
    handleEndChange = (date)=> {
        this.setState({
          endDate: date
        });
    }

    renderAdminFee = ()=>{
        var jsx = this.state.items.map((val,index)=>{
            return (
            <tr key={index}>
                <td>{val.description}</td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>
                    {String(val.amount).includes("%")?
                     val.amount :
                     parseInt(val.amount)/parseInt(this.state.rows.loan_amount)*100 +"%"}
                </td>
                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>{String(val.amount).includes("%")  ?
                    this.formatMoney(parseInt(val.amount.slice(0,val.amount.indexOf("%")))*this.state.rows.loan_amount/100):
                    this.formatMoney(parseInt(val.amount))}</td>
            </tr>
            )
        })
        return jsx
    }
   
    
    btnTerimaPinjaman = ()=>{
        const {endDate} = this.state
        if (endDate === null){
            this.setState({errorMessage:"Tanggal Pencairan Kosong - Harap Cek Ulang"})
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
            this.setState({dateApprove: newFormatEndDate},()=>{
                this.getDataDetailBtn('terima')
            });
        }
    }


    btnTolakPinjaman = ()=>{
        const reject = this.state.reason

        if(!reject || reject.trim()===''){
            this.setState({errorMessage:"Alasan Penolakan Kosong - Harap Cek Ulang"})
        }else{
            this.getDataDetailBtn('tolak')
        }
      
    }

    btnBack = ()=>{
        window.history.back()
    }

    getBiayaAdmin =()=>{
        var jsx = this.state.items
        .map((val,index)=>{
            return (
                    <tr key={index}>
                    <td>{val.description}</td>
                    <td>: {this.formatMoney(parseInt(val.amount))}</td>
                    </tr>
            )
        })
         return jsx;
    }

    renderFormInfoJsx = ()=>{
        var jsx = this.state.formInfo.map((val,index)=>{
            return(
                <GridDetail
                    key={index}
                    gridLabel={[3,7]}
                    label={
                        [
                            [val.label]
                        ] 
                    }
                    data={this.state.rows && [
                        [this.desctructFormInfo(val.answers).toString()]
                    ]
                }                 
                />
            )
        })
        return jsx
    }

    desctructFormInfo = (array)=>{
        var newArray=[]

        for(var i=0;i<array.length;i++){
            for (const key in array[i]){
                newArray.push(key)
            }
        }

        return newArray
    }
    calculateConvienceFee = (percent)=>{
        var imbalhasil = this.state.rows.interest*this.state.rows.loan_amount/100
        var total = this.state.items.map((val)=>{
            return parseInt(val.amount) * this.state.rows.loan_amount/100
        })
        if(percent) {
            return (parseInt(this.state.rows.total_loan)-parseInt(this.state.rows.loan_amount)-parseInt(imbalhasil) - parseInt(total)) / parseInt(this.state.rows.loan_amount) * 100 
        } else {
            return this.formatMoney(parseInt(this.state.rows.total_loan)-parseInt(this.state.rows.loan_amount)-parseInt(imbalhasil) - parseInt(total))
        }
    }

    onChangeTextField = (e, labelData, number) => {
        let dataText = e.target.value;

        if(number && isNaN(dataText)) {           
            dataText = this.state[labelData];          
        }

        this.setState({[labelData]:dataText})
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
                        title={'Permintaan Pinjaman - Detail'}
                    />

                </Grid>

                <Grid
                    item
                    sm={12} xs={12}
                    style={{padding:10, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                >
                    
                    <Grid container>

                        <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                            <ActionComponent
                                permissionApprove={checkPermission("lender_loan_approve_reject") && this.state.status === 'processing' ? (e) => this.btnTerimaPinjaman : null}
                                permissionReject={checkPermission("lender_loan_approve_reject") && this.state.status === 'processing' ? (e) => this.btnTolakPinjaman : null}
                                onCancel={this.btnBack}
                            />
                        </Grid> 

                        <Grid item sm={12} xs={12} style={{color:'red'}}>
                            {this.state.errorMessage}
                        </Grid>

                        <Grid container style={{paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                            <Grid item xs={3} sm={3}>
                                {
                                    this.state.status && (this.state.status === "processing" || this.state.status === "approved") &&
                                    <b>Tanggal Pencairan</b>
                                }
                            </Grid>
                            <Grid item xs={9} sm={9} style={{alignItems:"left"}}>
                                {
                                    this.state.status && (this.state.status === "processing" || this.state.status === "approved") &&
                                    <b style={{marginRight:'10px'}}>:</b>
                                }
                                
                                {
                                    this.state.status && this.state.status === "processing" &&
                                    
                                    <DatePicker
                                        type='dateOnly'
                                        onChange={this.handleEndChange}
                                        value={this.state.endDate}
                                        style={{top:"-20px",border:"1px solid grey",borderRadius:"3px"}}
                                        InputProps={{disableUnderline: true}}
                                    />
                                }
                                {
                                    this.state.status && this.state.status === "approved" &&
                                    <Moment date={this.state.rows.disburse_date} format=" DD  MMMM  YYYY" />   
                                }
                                {
                                    this.state.rows.disburse_date_changed &&
                                    <b> (Telah Diubah)</b>
                                }
                            </Grid>


                        </Grid>

                        {
                            this.state.status && (this.state.status === "processing" || this.state.status === "rejected") &&
                            <Grid container style={{paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                                <Grid item xs={3} sm={3}>
                                    <b>Alasan Penolakan</b>
                                </Grid>
                                <Grid item xs={4} sm={4} >
                                    {
                                        this.state.status === "processing" &&
                                        <TextField
                                            id="reason"
                                            value={this.state.reason}
                                            onChange={(e) => this.onChangeTextField(e,'reason')} 
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    }
                                    {
                                        this.state.status === "rejected" &&
                                        this.state.rows.reject_reason
                                    }
                                    
                                </Grid>
                            </Grid>
                        }

                    {/* -----------------------------------------------------FIRST ROW----------------------------------------------------------------- */}
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

                    {/* -----------------------------------------------------SECOND ROW----------------------------------------------------------------- */}
                        <GridDetail
                            gridLabel={[5,5]}
                            label={
                            [
                                
                                ['Pinjaman Pokok','Tenor (Bulan)','Total Pinjaman','Angsuran Perbulan'],
                                this.state.status==='processing'? 
                                ['Tujuan Pinjaman','Detail Tujuan','Tanggal Pengajuan']   :
                                ['Tujuan Pinjaman','Detail Tujuan','Tanggal Pengajuan', 
                                this.state.status==='approved'?"Tanggal Persetujuan":"Tanggal Ditolak"]
                            ] 
                            }
                            data={this.state.rows && [
                                [
                                    this.formatMoney(parseInt(this.state.rows.loan_amount)),
                                    this.state.rows.installment,
                                    this.formatMoney(parseInt(this.state.rows.total_loan)),
                                    this.formatMoney(parseInt(this.state.rows.layaway_plan)),
                                ],
                                this.state.status==='processing'?
                                [
                                    this.state.rows.loan_intention,
                                    this.state.rows.intention_details,
                                    handleFormatDate(this.state.rows.created_at)          
                                ] :
                                [
                                    this.state.rows.loan_intention,
                                    this.state.rows.intention_details,
                                    handleFormatDate(this.state.rows.created_at),
                                    handleFormatDate(this.state.rows.updated_at)           
                                ],
                                []
                            ]}                 
                        />

                 
                    {/* Fee Section */}
                        <GridDetail
                            gridLabel={[8]}
                            noEquals
                            label={[
                                ['','Imbal Hasil/ Bunga','Admin Fee','Convenience Fee'],
                                [
                                    '(Jumlah)',
                                    "Rp. "+formatNumber(this.state.rows && this.state.rows.loan_amount && this.state.rows.interest && parseFloat(this.state.rows.interest * this.state.rows.loan_amount / 100).toFixed(0), true),
                                    "Rp. "+formatNumber(findAmount(this.state.rows && this.state.rows.fees, 'Admin Fee',this.state.rows && this.state.rows.loan_amount,false), true),
                                    "Rp. "+formatNumber(findAmount(this.state.rows && this.state.rows.fees, 'Convenience Fee',this.state.rows && this.state.rows.loan_amount,false), true)
                
                
                                ],
                                ['','','','']
                        
                            ]}
                            data={this.state.rows && [
                                [
                                    '<b>(%)',
                                    `<b>${parseFloat(this.state.rows.interest).toFixed(2)}%`,
                                    `<b>${findAmount(this.state.rows && this.state.rows.fees, 'Admin Fee',this.state.rows && this.state.rows.loan_amount,true)}%`,
                                    `<b>${findAmount(this.state.rows && this.state.rows.fees, 'Convenience Fee',this.state.rows && this.state.rows.loan_amount,true)}%`
                                ],
                                [' ',' ',' ',' '],
                                [' ',' ',' ',' '],
                                [' ',' ',' ',' '],
                            ]}   
                        />


                
            
                    {/* -----------------------------------------------------THIRD ROW----------------------------------------------------------------- */}
            
                        <GridDetail
                            title={'Info Penghasilan Saat Pengajuan'}
                            gridLabel={[3]}
                            label={[
                                ['Pendapatan perbulan','Penghasilan lain-lain (jika ada)','Sumber Penghasilan lain-lain']
                            ]}
                            data={this.state.rows && this.state.borrowerDetail&& [
                                [
                                this.state.borrowerDetail.monthly_income?
                                this.formatMoney(parseInt(this.state.borrowerDetail.monthly_income))
                                :0,
                                this.state.borrowerDetail.other_income?this.formatMoney(parseInt(this.state.borrowerDetail.other_income)):0,
                                this.state.borrowerDetail.other_incomesource
                                ],
                                
                            ]}                 
                        />

                        {this.renderFormInfoJsx()}
           
             
                        


                  

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