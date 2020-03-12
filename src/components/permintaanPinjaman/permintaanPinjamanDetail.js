import React from 'react'
import { Redirect } from 'react-router-dom'
import Moment from 'react-moment'
import swal from 'sweetalert';
import { getPermintaanPinjamanDetailFunction } from './saga';
import Loader from 'react-loader-spinner'
import { checkPermission, handleFormatDate,formatNumber, findAmount } from './../global/globalFunction'
import { getTokenAuth, getTokenClient } from '../index/token';
import GridDetail from './../subComponent/GridDetail'
import TitleBar from '../subComponent/TitleBar';
import { Button } from '@material-ui/core';
import DatePicker from './../subComponent/DateTimePicker'
import { Grid, Tooltip, IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

class Main extends React.Component{
    _isMounted=false

    state = {errorMessage:'',rows:{},formInfo:[],items:[],borrowerDetail:{},status:'',endDate:null,diterima:false,ditolak:false,productInfo:'',loading:true,dateApprove:null,reason:null}

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
                    this.setState({rows:data.dataLender,
                        formInfo:data.dataLender.form_info,
                        items:data.dataLender.fees,
                        status:data.dataLender.status,
                        borrowerDetail:data.dataLender.borrower_info,
                        loading:false})
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
        var reject = this.refs.alasanPenolakan.value

        if(!reject || reject.trim()===''){
            this.setState({errorMessage:"Alasan Penolakan Kosong - Harap Cek Ulang"})
        }else{
            this.setState({reason: reject}, () => { this.getDataDetailBtn('tolak')});
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
                <Grid key={index} container style={{paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                        
                <Grid item sm={3} xs={3}>
                    <b>{val.label}</b>
                </Grid>

                <Grid item sm={9} xs={9} style={{alignItems:"left",marginBottom:"20px"}}>
                <b style={{marginRight:'10px'}}>:</b>
                {this.desctructFormInfo(val.answers).toString()}
                </Grid>

        </Grid>
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

    render(){
        if(this.state.loading){
            return(
                <Loader 
                type="ThreeDots"
                color="#00BFFF"
                height="30"	
                width="30"
                />  
            )
        }
        if(this.state.diterima){
            return (
                <Redirect to='/pinjamansetuju' />
            )   
        }
        
        if(this.state.ditolak){
            return (
                <Redirect to='/pinjamanrejected' />
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
                    
                <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                    <Tooltip title="Back" style={{outline:'none'}}>
                        <IconButton aria-label="cancel" onClick={this.btnBack}>
                            <CancelIcon style={{width:'35px',height:'35px'}}/>
                        </IconButton>
                    </Tooltip>       
                </Grid> 
                   <Grid container>
                    <Grid item sm={12} xs={12} style={{color:'red'}}>
                        {this.state.errorMessage}
                    </Grid>

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
                            <Grid item xs={9} sm={9} >
                                <b style={{marginRight:'10px'}} >:</b>
                                {
                                    this.state.status === "processing" &&
                                    <input type="text" ref="alasanPenolakan" placeholder="Masukan alasan.." style={{width:"250px",borderRadius:"3px"}}/>
                                }
                                {
                                    this.state.status === "rejected" &&
                                    this.state.rows.reject_reason
                                }
                                
                            </Grid>
                        </Grid>
                    }

                    <Grid container style={{marginBottom:'10px', marginTop:'10px', paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                        <Grid item xs={12} sm={12}>
                            {
                                checkPermission("lender_loan_approve_reject") && this.state.rows.status === 'processing' &&
                                <Button disableElevation
                                    variant='contained'
                                    style={{marginRight:'10px',padding: '2px', width:'100px',backgroundColor:'rgb(32, 184, 137)', color:'white'}}
                                    onClick={this.btnTerimaPinjaman}
                                >
                                   <b>Terima</b> 
                                </Button>
                            }

                            {
                                checkPermission("lender_loan_approve_reject") && this.state.rows.status === 'processing' &&
                                <Button disableElevation
                                    variant='contained'
                                    style={{marginRight:'10px',padding: '2px', width:'100px',backgroundColor:'rgb(238, 105, 105)', color:'white'}}
                                    onClick={this.btnTolakPinjaman}
                                >
                                    <b>Tolak</b>
                                </Button>
                            }  
                            
                        </Grid>

                        
                    </Grid>

                  

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