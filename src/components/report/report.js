import React from 'react'
import { Redirect } from 'react-router-dom'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import DatePickers from './../subComponent/DatePicker'
import { GlobalFunction } from './../globalFunction'
import { getAllBankListFunction, getAllLoanDataFunction } from './saga';
import { getToken } from '../index/token';


  const styles = (theme) => ({
    // root: theme.mixins.gutters({
    //   paddingTop: 16,
    //   paddingBottom: 16,
    //   marginTop: theme.spacing.unit * 3,
    // }),
    heading: {
      flex: '0 0 auto',
      fontSize: '18px',
      width: '50vw',
      fontWeight: '800',
    },
    container: {
      flexGrow: 1,
    },
    textField: {
      width: '90%',
      position: 'relative',
      top: '0.275vh',
      marginBottom: '1vh',
    },
    textFieldModify: {
      width: '97.5%',
      marginBottom: '1vh',
    },
    textfieldName: {
      width: '90%',
      marginBottom: '1vh',
      position: 'relative',
      top: '0.2vh',
    },
  });

class Report extends React.Component{
    _isMounted = false
    state ={munculinTable:false,pilihReport:false, 
        tanggalAwal:null,tanggalAkhir:null,
        tanggalAwalPencairan:null,tanggalAkhirPencairan:null,
        errorMessagePencairan:'',errorMessage:'',errorMessageBank:'',dataBank:[],namaBank:null,loading:false}
    componentDidMount(){
        this.getDataBankList()
        this._isMounted = true
    }

    componentWillUnmount(){
        this._isMounted=false
    }
    
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error,errorMessageBank:newProps.error,errorMessagePencairan:newProps.error})
    }
    
    //----------------------- GET DATA LIST BANK ---------------------
    getDataBankList = async function(){
        const param={}
        const data = await getAllBankListFunction(param)

        if(data){
            if(!data.error){
                this.setState({dataBank:data.BankList})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    renderBankList = () =>{
        var jsx = this.state.dataBank.map((val,index)=>{
            return (
                <option key={index} value={val.name}>{val.name}</option>
            )
        })
        return jsx
    }
    handleBank = (e)=>{
        this.setState({namaBank:e.target.value})
    }
    //---------------------- HANDLE CONVINIENCE FEE ---------------------
    handleChangeFee = (e)=>{
        if(e.target.value === "1"){
            this.setState({pilihReport:true})
        }else{
            this.setState({pilihReport:false})
        }
    }
    validate = () => {
        let flag = true;
        const {tanggalAkhir,tanggalAwal,tanggalAwalPencairan,tanggalAkhirPencairan,namaBank} = this.state
        let dateAwal = new Date(tanggalAwal).getTime()
        let dateAkhir = new Date(tanggalAkhir).getTime()
 
        let tglPencairanAwal = new Date(tanggalAwalPencairan).getTime()
        let tglPencairanAkhir = new Date(tanggalAkhirPencairan).getTime()
 
 
         if(tanggalAwal === null || tanggalAkhir ===null){
             this.setState({errorMessage:"Tanggal Kosong - Harap cek ulang",errorMessagePencairan:'',errorMessageBank:''})
             flag=false
         }
         else if(dateAwal > dateAkhir){
            this.setState({errorMessage:"Range Tanggal tidak benar - Harap cek ulang",errorMessagePencairan:'',errorMessageBank:''}) 
             flag=false
         } 
         else if(tglPencairanAwal>tglPencairanAkhir){
             this.setState({errorMessagePencairan:"Range Tanggal Pencairan tidak benar - Harap cek ulang",errorMessage:'',errorMessageBank:''}) 
             flag=false
         } 
         else if(namaBank === "0" || namaBank === null){
             this.setState({errorMessageBank:"Bank Kosong - Harap cek ulang",errorMessage:'',errorMessagePencairan:''}) 
             flag=false
         }

         return flag
    }
    //---------------------- HANDLE TANGGAL ---------------------
    handleEndChange = (e)=>{
        this.setState({tanggalAkhir:e.target.value.toString().trim().length !== 0 ? e.target.value : null,errorMessage:''})
    }
    handleStartChange = (e)=>{
        this.setState({tanggalAwal:e.target.value.toString().trim().length !== 0 ? e.target.value : null,errorMessage:''})
    }

    handleStartPencairanChange = (e)=>{
        this.setState({tanggalAwalPencairan:e.target.value.toString().trim().length !== 0 ? e.target.value : null,errorMessage:'',errorMessagePencairan:''})
    }
    handleEndPencairanChange = (e)=>{
        this.setState({tanggalAkhirPencairan:e.target.value.toString().trim().length !== 0 ? e.target.value : null,errorMessage:'',errorMessagePencairan:''})
    }
    //---------------------- HANDLE BUTTON PROSES ---------------------
    btnShowReport = ()=>{
       const {tanggalAkhir,tanggalAwal,tanggalAwalPencairan,tanggalAkhirPencairan,namaBank} = this.state
            if(this.validate()) {
                this.setState({loading:true})
                let newTanggalAwal = tanggalAwal+"T00:00:00.000Z"
                let newTanggalBack = tanggalAkhir+"T23:59:59.000Z"

                let newTanggalPencairanAwal = tanggalAwalPencairan+"T00:00:00.000Z" 
                let newTanggalPencairanAkhir = tanggalAkhirPencairan+"T23:59:59.000Z"

                const param ={
                    bank_name:namaBank,
                    start_approval_date:newTanggalAwal,
                    end_approval_date:newTanggalBack,
                }
                
                if(tanggalAwalPencairan) {
                    param.start_disburse_date = newTanggalPencairanAwal
                }
                if(tanggalAkhirPencairan){
                    param.end_disburse_date = newTanggalPencairanAkhir
                }
                
                this.getAllLoanData(param)
            }
    }
    getAllLoanData = async function (params) {
        const data = await getAllLoanDataFunction(params)
        if(data){
            if(!data.error){
                this.setState({dataReport:data.reportFee.data,errorMessage:"",errorMessageBank:'',errorMessagePencairan:'',munculinTable:true,loading:false})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    
    renderReportJsx =()=>{
        var jsx = this.state.dataReport.map((val,index)=>{
            return(
                <tr key={index}>
                    <td align="center">{index+1}</td>
                    <td align="center">{val.bank_name}</td>
                    <td align="center">{val.service_name}</td>
                    <td align="center">{val.product_name}</td>
                    <td align="center">{val.loan_id}</td>
                    <td align="center">{GlobalFunction.formatMoney(val.plafond)}</td>
                    <td align="center">{GlobalFunction.formatMoney(val.convenience_fee)}</td>
                </tr>
            )
        })
        return jsx
    }
    getTotalHarga = ()=>{
        var harga=0
        
         for (var i=0;i<this.state.dataReport.length;i++){
            harga += parseInt(this.state.dataReport[i].convenience_fee)
         }
       
         return GlobalFunction.formatMoney(harga) 
    }
    renderLoadingBtn = ()=>{
        if(this.state.loading === true){
            return <input disabled type="button" className="btn btn-success" value="Proses" onClick={this.btnShowReport}/>
         }else{
            return <input type="button" className="btn btn-success" value="Proses" onClick={this.btnShowReport}/>
         }
    }
    btnReset = ()=>{
        this.setState({errorMessage:"",errorMessageBank:'',munculinTable:false,namaBank:null})
        document.getElementById("bankName").value ="0"
    }
    render(){
        if(getToken()){
            return(
                <div className="container mt-2">
                   
                    <h2>Report</h2>
                    <hr></hr>
                    <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                {this.state.errorMessage}{this.state.errorMessageBank}{this.state.errorMessagePencairan}
                            </div>      
                     </div>
                    <div className="form-group row">
                        <label className="col-sm-2 col-form-label">Nama Report</label>
                        <div className="col-sm-10">
                        <select ref="convfee" onChange={this.handleChangeFee} id="report" className="form-control">
                            <option value={0}>======== Pilih Report ========</option>
                            <option value="1">Convenience Fee Report</option>                                
                        </select>
                        </div>
                    </div>
                     {this.state.pilihReport?
                        <form>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama Bank</label>
                            <div className="col-sm-10">
                            <select ref="bankName" id="bankName" onChange={this.handleBank} className="form-control">
                                <option value={0}>======== Pilih Bank ========</option>
                                {this.renderBankList()}
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Tanggal Pinjaman Disetujui</label>
                            <div className="col-sm-10 form-inline pl-5">
                            <div className="col-sm-1 form-inline"></div>
                                <div className="col-sm-3 form-inline">
                                    <DatePickers
                                        label = 'Dari Tanggal'
                                        onChange ={this.handleStartChange}
                                        value={this.state.tanggalAwal}
                                        error={this.state.errorMessage && this.state.errorMessage.trim().length !== 0 && true}
                                    />
                                </div>
                                <div className="form-inline mr-3 ml-3"><i className="fas fa-long-arrow-alt-right"></i></div>
                                <div className="col-sm-3 form-inline">
                                    <DatePickers
                                        label = 'Sampai Tanggal'
                                        onChange ={this.handleEndChange}
                                        value={this.state.tanggalAkhir}
                                        error={this.state.errorMessage && this.state.errorMessage.trim().length !== 0 && true}
                                    />
                                </div>
                            </div>
                    
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Tanggal Pencairan</label>
                            <div className="col-sm-10 form-inline pl-5">
                            <div className="col-sm-1 form-inline"></div>
                                <div className="col-sm-3 form-inline">
                                    <DatePickers
                                        label = 'Dari Tanggal'
                                        onChange ={this.handleStartPencairanChange}
                                        value={this.state.tanggalAwalPencairan}
                                        error={this.state.errorMessagePencairan && this.state.errorMessagePencairan.trim().length !== 0 && true}
                                    />
                                </div>
                                <div className="form-inline mr-3 ml-3"><i className="fas fa-long-arrow-alt-right"></i></div>
                                <div className="col-sm-3 form-inline">
                                    <DatePickers
                                        label = 'Sampai Tanggal'
                                        onChange ={this.handleEndPencairanChange}
                                        value={this.state.tanggalAkhirPencairan}
                                        error={this.state.errorMessagePencairan && this.state.errorMessagePencairan.trim().length !== 0 && true}
                                    />
                                </div>
                            </div>
                    
                        </div>
                       {this.renderLoadingBtn()}
                        <input type="button" className="btn btn-secondary ml-2" value="Reset" onClick={this.btnReset}/>
                    </form>
                    :null}

                    {this.state.munculinTable ?
                        <div>
                            <hr/>
                            <table className="table table-hover">
                                <thead className="table-warning">
                                    <tr >
                                        <th className="text-center" scope="col">#</th>
                                        <th className="text-center" scope="col">Nama Bank</th>
                                        <th className="text-center" scope="col">Layanan</th>
                                        <th className="text-center" scope="col">Produk</th>
                                        <th className="text-center" scope="col">Loan Id</th>  
                                        <th className="text-center" scope="col">Plafond</th>  
                                        <th className="text-center" scope="col">Convinience Fee Amount</th> 
                                    </tr>     
                                </thead>
                                <tbody>

                                    {this.state.dataReport.length===0?
                                    <tr align="center">
                                        <th colSpan={7}>
                                        <p style={{marginRight:"50px"}}>DATA KOSONG</p>
                                        </th>
                                    </tr>
                                    :this.renderReportJsx()} 
                                    <tr align="right">
                                        <th colSpan={7}>
                                        <p style={{marginRight:"50px"}}>{this.getTotalHarga()}</p>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>    
                    :null}
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


export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   },
    //   getApplication: () => {
    //     dispatch(applicationRequest());
    //   },
    //   getSecurityAdministrator: (application) => {
    //     dispatch(securityAdministratorRequest(application));
    //   },
    //   getToken: (application) => {
    //     dispatch(rpsTokenRequest(application));
    //   },
    //   getTokenUpdate: (application) => {
    //     dispatch(rpsTokenUpdateRequest(application));
    //   },
    //   getAction: (application) => {
    //     dispatch(rpsActionRequest(application));
    //   },
    //   getProfileUserId: (application) => {
    //     dispatch(profileUserIdRequest(application));
    //   },
    //   getCurrency: () => {
    //     dispatch(currencyRequest());
    //   },
    //   getKanwil: () => {
    //     dispatch(kanwilRequest());
    //   },
    //   getKCU: (kanwil) => {
    //     dispatch(kcuRequest(kanwil));
    //   },
    //   getBranch: (kodeKcu) => {
    //     dispatch(branchRequest(kodeKcu));
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    //   handleCreaterpsTransaction: (rpsTransaction) => {
    //     dispatch(rpsTransactionCreate(rpsTransaction));
    //   },
    //   handleUpdaterpsTransaction: (rpsTransaction) => {
    //     dispatch(rpsTransactionUpdate(rpsTransaction));
    //   },
    //   handleGetrpsUserIdDetail: (rpsUserId) => {
    //     dispatch(rpsUserIdDetail(rpsUserId));
    //   },
    //   handleGetDetailProfileUser: (rpsUserId) => {
    //     dispatch(rpsProfileUserDetail(rpsUserId));
    //   },
    //   handleDelete: (rpsUserId) => {
    //     dispatch(rpsUserIdDelete(rpsUserId));
    //   },
    //   handleSetMessage: (message) => {
    //     dispatch(setAlert(message));
    //   },
    };
  }
  
  export const mapStateToProps = createStructuredSelector({
    // user: getUserState(),
    // menu: getMenu(),
    // rpsUserIdDetailNew: getrpsUserIdDetail(),
    // profileUserDetail: getrpsProfileUserDetail(),
    // listSourceTransaction: getListSourceTransaction(),
    // listAction: getListAction(),
    // listToken: getListToken(),
    // listEmployee: getListEmployee(),
    // listBranch: getListBranch(),
    // listApplication: getListApplication(),
    // listSecurityAdministrator: getListSecurityAdministrator(),
    // listCurrency: getListCurrency(),
    // listprofileUserId: getListProfileUserId(),
    // listKanwil: getListKanwil(),
    // listKCU: getListKCU(),
    // message: getMessageValue(),
    // redirect: getRedirectValue(),
    // fetching: getFetchStatus(),
  });

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);
// const withReducer = injectReducer({ key: 'rpsTransaction', reducer });
// const withSaga = injectSaga({ key: 'rpsTransaction', saga });

export default compose(
    // withReducer,
    withConnect,
    // withSaga,
    withStyle,
    withRouter
  )(Report);
// export default RoleAdd;

