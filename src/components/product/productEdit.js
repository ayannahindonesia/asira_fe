import React from 'react'
import { Redirect } from 'react-router-dom'
import Select from 'react-select/creatable'
import './../../support/css/productEdit.css'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { editProductFunction, detailProductFunction,detailServiceProductFunction} from './saga';
import { getAllLayananListFunction, getDetailLayananFunction } from '../layanan/saga';
import { getToken } from '../index/token';
import Loader from 'react-loader-spinner'

const options = [
    { value: 'pendidikan', label: 'Pendidikan' },
    { value: 'konsumtif', label: 'Konsumtif' }
  ];
const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'grey',
      padding: 20,
    }),
    control: () => ({
      // none of react-select's styles are passed to <Control />
      width: "50%",float:"left", marginLeft:"112px",
      border:"1px solid #CED4DA", borderRadius:"2px"
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }
  }

 

class ProductEdit extends React.Component{
    state = {
    selectedOption: null, errorMessage:null,rentangDari:0,rentangAkhir:0,loading:true,
    collaterals:[],
    bankService:[],diKlik:false,rows:[],fees:[],bankServicebyID:{},financing_sector:[],asn_fee:'',
    agunan:["Sertifikat Tanah","Sertifikat Rumah","Kios/Lapak","Deposito","BPKB Kendaraan"],
    check:false,
    submit:false,
    checkAsuransi:false,
    checkAgunan:false
    };
    _isMounted = false
    componentDidMount(){
        this._isMounted = true
        this.getBankService()
        this.getProductDetailId()
    }
    componentWillUnmount (){
        this._isMounted = false
    }
       
    
    getProductDetailId= async function (params) {
        const id = this.props.match.params.id
        const data = await detailProductFunction({id},detailServiceProductFunction)

        if(data){
        if(!data.error){
            this.setState({
                rows:data.dataProduct,
                fees:data.dataProduct.fees,
                asn_fee:data.dataProduct.asn_fee,
                collaterals:data.dataProduct.collaterals,
                financing_sector:data.dataProduct.financing_sector.map((val)=>{
                    return   { value: val, label: val }
                }),
                check:data.dataProduct.status ==="active"? true: false,
                checkAsuransi: data.dataProduct.assurance === "null" ?false:true,
                checkAgunan:data.dataProduct 
                && data.dataProduct.collaterals
                && data.dataProduct.collaterals[0]
                &&data.dataProduct.collaterals[0] !== ("Sertifikat Tanah")
                && data.dataProduct.collaterals[0] !==("Sertifikat Rumah")
                && data.dataProduct.collaterals[0] !== ("Kios/Lapak")
                && data.dataProduct.collaterals[0] !== ("Deposito")
                && data.dataProduct.collaterals[0] !== ("BPKB Kendaraan")
                && data.dataProduct.collaterals[0].trim().length !== 0
                
                ?true:false,
                bankServicebyID:data.serviceProduct,loading:false
            })
        }else{
            this.setState({errorMessage:data.error})
        }
        }
    }
    
      
    handleChange = (selectedOption) => {
    this.setState({ financing_sector: selectedOption });
    };

    

    btnEditProduct = ()=>{
    var id = this.props.match.params.id
    var i
    var name = this.refs.namaProduct.value? this.refs.namaProduct.value:this.refs.namaProduct.placeholder
    var min_timespan = parseInt(this.refs.jangkaWaktuDari.value)
    var max_timespan = parseInt(this.refs.jangkaWaktuSampai.value)
    var interest = this.refs.imbalHasil.value ? parseInt(this.refs.imbalHasil.value) : parseInt(this.refs.imbalHasil.placeholder)
    var min_loan = this.state.rentangDari ? parseInt(this.state.rentangDari) : this.state.rows.min_loan
    var max_loan = this.state.rentangAkhir ? parseInt(this.state.rentangAkhir) : this.state.rows.max_loan
    var adminfee = this.refs.AdminFee.value ? this.refs.AdminFee.value : this.refs.AdminFee.placeholder
    var asn_fee = this.refs.ConvenienceFee.value ? this.refs.ConvenienceFee.value : this.refs.ConvenienceFee.placeholder
    var service_id = parseInt(this.refs.layanan.value)

    var fees= []
    var status =   this.state.check ?  "active" : "inactive"
    var assurance =  document.querySelector('.asuransi').checked;
    var otheragunan =  document.querySelector('.otheragunan').checked;

    assurance = assurance ? assurance = this.refs.asuransi.value : assurance="null"
    
    otheragunan = otheragunan ? otheragunan = this.refs.lainnya.value : otheragunan = ""

    if(min_timespan==="0" || max_timespan==="0"){
    this.setState({errorMessage:"Jangka Waktu Kosong"})
    }else if(parseInt(min_timespan) > parseInt(max_timespan)){
    this.setState({errorMessage:"Jangka Waktu dari lebih besar - Harap cek ulang"})
    }else if(parseFloat(interest)<0 || parseInt(interest)===0){
    this.setState({errorMessage:"Imbal Hasil tidak bole minus/ kosong - Harap cek ulang"})
    }else if(parseFloat(interest)>200){
    this.setState({errorMessage:"Imbal Hasil tidak boleh lebih dari 200 - Harap cek ulang"})
    }else if(!this.state.financing_sector){
        this.setState({errorMessage:"Sektor Pembiayaan Kosong - Harap di isi"})
    }
    else if(parseInt(min_loan) > parseInt(max_loan)){
    this.setState({errorMessage:"Rentang Pengajuan tidak benar - Harap cek ulang"})
    }else if(parseFloat(adminfee) <0){
    this.setState({errorMessage:"Admin Fee tidak benar - Harap cek ulang"})
    }else if(parseFloat(adminfee) >100){
    this.setState({errorMessage:"Admin Fee lebih dari 100%- Harap cek ulang"})
    }else if(parseFloat(asn_fee) >100){
    this.setState({errorMessage:"Convinience Fee lebih dari 100% - Harap cek ulang"})
    }else if(parseFloat(asn_fee) <0){
    this.setState({errorMessage:"Convinience Fee tidak benar - Harap cek ulang"})
    }else if(isNaN(asn_fee)){
    this.setState({errorMessage:"Convience Fee harus angka atau desimal harus menggunakan titik (.) contoh 2.00  - Harap cek ulang"})
    }else if(isNaN(adminfee)){
    this.setState({errorMessage:"Admin Fee harus angka atau desimal harus menggunakan titik (.) contoh 2.00 - Harap cek ulang"})
    }
    else{
    this.setState({submit:true})
    String(adminfee)
    fees.push({
        "description": "Admin Fee",
        "amount":`${adminfee}%`
    },{
        "description": "Convenience Fee",
        "amount":`${asn_fee}%`
    })
        //===========CODING BAGIAN SEKTOR PEMBIAYAAN
            
            if(this.state.financing_sector){
                var financing_sector = this.state.financing_sector.map((val)=>{

                    return val.value
                })
                if(financing_sector.includes('')){
                    financing_sector.shift()
                }
            }else{
                financing_sector = [null]
            }

        //======= CODING BAGIAN AGUNAN
            var collaterals =[]
            var agunan = document.querySelectorAll('.agunan:checked')

            if (agunan.length===0 && otheragunan === ''){
                collaterals=['']
            }else{
                for ( i = 0; i < agunan.length; i++) {
                    collaterals.push(agunan[i].value)   
                }
                if (otheragunan !== ""){
                    collaterals.push(otheragunan)
                }
            }
            
            collaterals.reverse()
    var newData = {
        name,min_timespan,max_timespan,interest,min_loan,max_loan,fees,asn_fee,service_id,collaterals,financing_sector,assurance,status
    }
    const param = {newData,id}
    this.setState({submit:false})
    this.editProductBtn(param)
    }
    }

    editProductBtn = async function (params) {
    const data = await editProductFunction(params)
    if(data){
    if(!data.error){
    swal("Berhasil","Produk berhasil diEdit","success")
    this.setState({errorMessage:null,diKlik:true,submit:false})
    }else{
    this.setState({errorMessage:data.error})
    }
    }
    }

    renderBtnSumbit =()=>{
    if( this.state.submit) {
    return <input type="button" disabled className="btn btn-success" value="Simpan" onClick={this.btnEditProduct} style={{cursor:"wait"}}/>
    }else{
    return <input type="button" className="btn btn-success" value="Simpan" onClick={this.btnEditProduct}/>
    }
    }

    getBankService = async function () {
    const data = await getAllLayananListFunction({})
    if(data){
    if(!data.error){
        this.setState({bankService:data.listLayanan.data})
    }else{
        this.setState({errorMessage:data.error})
    }
    }
    }

    getBankServiceID = async function () {
        const param = {
            id: this.state.rows.service
        }
        const data = await getDetailLayananFunction(param)

        if(data){
            if(!data.error){
                this.setState({bankServicebyID:data.data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    renderBankService = ()=>{
    var jsx = this.state.bankService.map((val,index)=>{
    return   (<option key={index} value={val.id}>{val.name}</option>)
    })
    return jsx;
    }

    componentWillReceiveProps(newProps){
    this.setState({errorMessage:newProps.error})
    }

    renderAdminJsx =()=>{
    var jsx = this.state.fees.map((val,index)=>{
    return(
    <tr key={index}>
    <td>
    <label>{val.description}</label>
    </td>
    <td>
    <div className="form-inline">
    <input type="text" className="form-control" ref={val.description.replace(/ /g, '')} style={{width:"80px"}} defaultValue={val.amount.slice(0,val.amount.indexOf('%'))} placeholder={val.amount.slice(0,val.amount.indexOf('%'))} /><label>%</label>
    </div>
    </td>
    </tr>
    )
    })
    return jsx
    }

    renderAngunanJsx = ()=>{

    var jsx = this.state.agunan.map((val,index)=>{
    var dataSame= false
    for (var i=0;i < this.state.collaterals.length;i++){
    if (val === this.state.collaterals[i]){
    dataSame= true
    }
    }
    if (dataSame) {
    return (
    <div key={index} className="form-check form-check-inline">
    <input defaultChecked className="form-check-input agunan" type="checkbox" value={val}/>
    <label className="form-check-label">{val}</label>
    </div> 

    ) 
    }else {
    return (
    <div key={index} className="form-check form-check-inline">
    <input className="form-check-input agunan" type="checkbox" value={val}/>
    <label className="form-check-label">{val}</label>
    </div> 

    ) 
    }

    })
    return jsx

    }

    renderAgunanLainJsx =()=>{
    for (var i=0; i<this.state.collaterals.length;i++){

    if (!this.state.agunan.includes(this.state.collaterals[i]))
    {
    return (
        <div className="form-check form-check-inline">
        <input checked={this.state.checkAgunan} className="form-check-input otheragunan" onChange={this.handleCheckAgunan} type="checkbox" value="lainnya"/>
        <label className="form-check-label">Lainnya</label>
        <input type="text" ref="lainnya" style={{width:"200px"}} defaultValue={this.state.collaterals[i]} onChange={this.handleTextAgunan} className="form-control ml-2"/>
        </div> 
    )
    }else{
    return (
        <div className="form-check form-check-inline">
        <input checked={this.state.checkAgunan}  className="form-check-input otheragunan" onChange={this.handleCheckAgunan} type="checkbox" value="lainnya"/>
        <label className="form-check-label">Lainnya</label>
        <input type="text" ref="lainnya" style={{width:"200px"}} placeholder="Jika ada.." onChange={this.handleTextAgunan}  className="form-control ml-2"/>
        </div> 
    )
    }
    }  
    }

    btnCancel=()=>{
    this.setState({diKlik:true})
    }
    
    handleChecked=(e)=>{
    this.setState({check:!this.state.check})
    }

    handleCheckAsuransi = ()=>{
            this.setState({checkAsuransi:!this.state.checkAsuransi},()=>{
                if(!this.state.checkAsuransi){
                    this.refs.asuransi.value=''
                }
    
            })
    }  
    handleCheckAgunan = ()=>{
        this.setState({checkAgunan:!this.state.checkAgunan},()=>{
            if(!this.state.checkAgunan){
                this.refs.lainnya.value=''
            }

        })
    }  
    handleTextAgunan =(e)=>{
        e.target.value===""?
        this.setState({checkAgunan:false}):
            this.setState({checkAgunan:true})
    }

    handleTextAsuransi =(e)=>{
        e.target.value ===""?
            this.setState({checkAsuransi:false}):
            this.setState({checkAsuransi:true})
    }
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listproduct'/>            

        }
        if (this.state.loading){
            return (
                <div className="mt-2">
                 <Loader 
                    type="ThreeDots"
                    color="#00BFFF"
                    height="30"	
                    width="30"
                />  
                </div>
            )
        }else{
        if(getToken()){
            return(
                <div className="container">
                    <h2 className="mb-5">Produk - Ubah</h2> 
                  <form>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>
                                   <label>Nama Produk</label>
                                </td>
                                <td>
                                   <input disabled type="text" ref="namaProduct" className="form-control textfield" placeholder={this.state.rows.name} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                   <label>Jangka Waktu (Bulan)</label>
                                </td>
                                <td>
                                <select ref="jangkaWaktuDari" className="form-control option" style={{width:"150px"}}>
                                        <option value={this.state.rows.min_timespan}>{this.state.rows.min_timespan} </option>
                                        <optgroup label="___________">                                       
                                        <option value={6}>6 </option>
                                        <option value={12}>12 </option> 
                                        <option value={18}>18 </option> 
                                        <option value={24}>24 </option>
                                        <option value={30}>30 </option>  
                                        <option value={36}>36 </option>
                                        </optgroup>
                                </select>
                                <label style={{marginLeft:"80px",marginRight:"-90px"}}> s/d </label>
                                <select  ref="jangkaWaktuSampai" className="form-control option" style={{width:"150px"}}>
                                <option value={this.state.rows.max_timespan}> {this.state.rows.max_timespan}</option>     
                                <optgroup label="___________">    
                                        <option value={6}>6 </option>
                                        <option value={12}>12 </option> 
                                        <option value={18}>18 </option> 
                                        <option value={24}>24 </option>
                                        <option value={30}>30 </option>
                                        <option value={36}>36 </option>
                                    </optgroup>  
                                </select>
                                </td>
                            </tr>
                            <tr>
                                    <td>
                                       <label>Imbal Hasil</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <input type="number" defaultValue={this.state.rows.interest} className="form-control" ref="imbalHasil" style={{width:"80px"}} placeholder="0" /><label>%</label>
                                    </div>  
                                    </td>
                            </tr>
                            <tr>
                                    <td>
                                        <label>Rentang Pengajuan</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <NumberFormat placeholder={this.state.rows.min_loan}  onValueChange={(values) => {this.setState({rentangDari:values.value})}} className="form-control textfield" ref="rentangDari" thousandSeparator={true} prefix={'Rp. '} />
                                        <label style={{marginLeft:"20px",marginRight:"-95px"}}> s/d </label>
                                        <NumberFormat placeholder={this.state.rows.max_loan} onValueChange={(values) => {this.setState({rentangAkhir:values.value})}} className="form-control textfield" ref="rentangHingga" thousandSeparator={true} prefix={'Rp. '} />
                                    </div>
                                    </td>

                            </tr>
                                  {this.renderAdminJsx()}
                            <tr>
                                <td>
                                     <label>Layanan</label>
                                </td>
                                <td>
                                    <select ref="layanan" className="form-control">
                                            <option value={this.state.bankServicebyID.id}>{this.state.bankServicebyID.name}</option>
                                            <optgroup label="--------------------------------------------------------">    
                                            {this.renderBankService()}
                                           </optgroup>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                     <label>Agunan</label>
                                </td>
                                <td>
                                <div className="col-sm-10" style={{marginLeft:"105px"}}>
                                {this.renderAngunanJsx()}
                                {this.state.collaterals.length===0?
                                <div className="form-check form-check-inline">
                                <input className="form-check-input otheragunan" onChange={this.handleCheckAgunan} checked={this.state.checkAgunan} type="checkbox" value="lainnya"/>
                                <label className="form-check-label">Lainnya</label>
                                <input type="text" ref="lainnya" style={{width:"200px"}} placeholder="Jika ada.." className="form-control ml-2"/>
                                </div> 
                                :this.renderAgunanLainJsx()}
                            </div> 
                        
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label >Sektor Pembiayaan</label>
                                </td>
                                <td>
                                    <Select
                                        value={this.state.financing_sector}
                                        onChange={this.handleChange}
                                        isMulti={true}
                                        options={options}
                                        styles={customStyles}
                                    />
                                </td>
                            </tr>
                           
                            <tr>
                                <td>
                                    <label >Asuransi</label>
                                </td>
                                <td>
                                <div className="form-check-inline" style={{marginLeft:"125px"}}>
                                            <input  onChange={this.handleCheckAsuransi} className="form-check-input asuransi" type="checkbox" checked={this.state.checkAsuransi}/>
                                            <label className="form-check-label">Tersedia</label>
                                            <input type="text" onChange={this.handleTextAsuransi} className="ml-2" ref="asuransi"  defaultValue={this.state.rows.assurance==="null"?"-":this.state.rows.assurance}></input>
                               
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                     <label >Status</label>
                                </td>
                                <td>
                                <div className="form-check-inline" style={{marginLeft:"125px"}}>
                                        <input className="form-check-input messageCheckbox" type="checkbox" onChange={this.handleChecked} checked={this.state.check}/>
                                        <label className="form-check-label">{this.state.check ? 'Aktif' : 'Tidak Aktif'}</label>
                                </div> 
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="form-group row">
                                            <div style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                                    {this.state.errorMessage}
                                            </div>
                                    </div>
                                    {this.renderBtnSumbit()}
                                    <input type="button" className="inline-block btn btn-warning ml-2" value="Batal" onClick={this.btnCancel}/>
                                </td>
                            </tr>
                            </tbody>
                            
                        </table>
                        
                    </form>






                </div>
            )
        }
        if(!getToken())
        {
            return (
                <Redirect to='/login' />
            )    
        }
        }
    }
}

export default ProductEdit;