import React from 'react'
import { Redirect } from 'react-router-dom'
import Select from 'react-select/creatable';
import './../../support/css/productAdd.css'
import NumberFormat from 'react-number-format';
import swal from 'sweetalert'
import { addProductFunction} from './saga';
import { getToken } from '../index/token';
import { getAllLayananListFunction } from '../layanan/saga';

const options = [
    { value: 'Pendidikan', label: 'Pendidikan' },
    { value: 'Konsumtif', label: 'Konsumtif' }
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

 

class ProductAdd extends React.Component{
    _isMounted = false;
    state = {
    selectedOption: null, errorMessage:null,rentangDari:0,rentangAkhir:0,
    bankService:[],diKlik:false,check:false,submit:false,checkAsuransi:false
    };

    componentDidMount(){
        this._isMounted=true;
        this.getBankService()
    }
    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
    };

    btnSaveProduct = ()=>{
    var i
    var fees= []
    
    var name = this.refs.namaProduct.value
    var min_timespan = parseInt(this.refs.jangkaWaktuDari.value)
    var max_timespan = parseInt(this.refs.jangkaWaktuSampai.value)
    var interest = this.refs.imbalHasil.value ? parseInt(this.refs.imbalHasil.value) : parseInt(this.refs.imbalHasil.placeholder)
    var min_loan = parseInt(this.state.rentangDari)
    var max_loan = parseInt(this.state.rentangAkhir) 
    var adminfee = this.refs.adminFee.value ? this.refs.adminFee.value : this.refs.adminFee.placeholder
    
    var asn_fee = this.refs.convinienceFee.value ? this.refs.convinienceFee.value : this.refs.convinienceFee.placeholder
    var service_id = parseInt(this.refs.layanan.value)
    
    var status =  this.state.check?"active":"inactive"
    var assurance =  document.querySelector('.asuransi').checked;
    var otheragunan =  document.querySelector('.otheragunan').checked;
    
    assurance = assurance ? assurance = this.refs.asuransi.value : assurance="null"
    String(assurance)

    otheragunan = otheragunan ? otheragunan = this.refs.lainnya.value : otheragunan =""

    if(name==="" || name.trim()===""){
        this.setState({errorMessage:"Nama Product Kosong"})
    }else if (interest>200){
        this.setState({errorMessage:"Imbal Hasil tidak boleh lebih dari 200% - Harap cek ulang"})
    }else if(min_timespan==="0" || max_timespan==="0"){
        this.setState({errorMessage:"Jangka Waktu Kosong"})
    }else if(parseInt(min_timespan) > parseInt(max_timespan)){
        this.setState({errorMessage:"Jangka Waktu dari lebih besar - Harap cek ulang"})
    }
    else if(parseFloat(interest)<0 || parseInt(interest)===0){
        this.setState({errorMessage:"Imbal Hasil tidak bole minus/ kosong - Harap cek ulang"})
    }else if(parseInt(min_loan) > parseInt(max_loan) || parseInt(min_loan) === parseInt(max_loan) ){
        this.setState({errorMessage:"Rentang Pengajuan tidak benar - Harap cek ulang"})
    }else if(parseFloat(adminfee) <0){
        this.setState({errorMessage:"Admin Fee tidak benar - Harap cek ulang"})
    }else if(parseFloat(adminfee) >100){
        this.setState({errorMessage:"Admin Fee lebih dari 100% - Harap cek ulang"})
    }else if(parseFloat(asn_fee) <0){
        this.setState({errorMessage:"Convinience Fee tidak boleh minus - Harap cek ulang"})
    }else if(parseFloat(asn_fee) >100){
        this.setState({errorMessage:"Convinience Fee lebih dari 100% - Harap cek ulang"})
    }else if(parseInt(service_id)===0){
        this.setState({errorMessage:"Layanan belum terpilih - Harap cek ulang"})
    }else if(this.state.selectedOption===null){
        this.setState({errorMessage:"Sektor Pembiayaan belum terpilih - Harap cek ulang"})
    }else if(isNaN(asn_fee)){
        this.setState({errorMessage:"Convience Fee harus angka atau jika desimal menggunakan titik (.) Contoh: 2.00 - Harap cek ulang"})
    }
    else if(isNaN(adminfee)){
        this.setState({errorMessage:"Admin Fee harus angka atau jika desimal menggunakan titik (.) Contoh: 2.00 - Harap cek ulang"})
    }
    else{
        this.setState({submit:true})

        fees.push({
            "description": "Admin Fee",
            "amount":`${adminfee}%`
        },
        {
            "description": "Convenience Fee",
            "amount":`${asn_fee}%`
        })
        

            //===========CODING BAGIAN SEKTOR PEMBIAYAAN

                var financing_sector = []
                for ( i=0 ; i < this.state.selectedOption.length; i++){
                    financing_sector.push(this.state.selectedOption[i].value)
                }


            //======= CODING BAGIAN AGUNAN
                var collaterals =[]
                var agunan = document.querySelectorAll('.agunan:checked')
                

                for ( i = 0; i < agunan.length; i++) {
                    collaterals.push(agunan[i].value)   
                }
                
                if (otheragunan){
                    collaterals.push(otheragunan)
                }

            //====== BIKIN AGUNAN INDEX TERAKHIR JADI YANG PERTAMA BUAT EDIT NYA
                collaterals.reverse()
                
        var newData = {
            name,min_timespan,max_timespan,interest,min_loan,max_loan,fees,service_id,collaterals,financing_sector,assurance,status
        }
        
        this.productAddBtn(newData)
    }
    }

    productAddBtn = async function (params) {
        const data = await addProductFunction(params)
        if(data){
            if(!data.error){
            swal("Berhasil","Produk berhasil bertambah","success")
            this.setState({errorMessage:null,diKlik:true,submit:false})
            }else{
            this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
      
    handleTextAsuransi =(e)=>{
        e.target.value.trim() ===""?
            this.setState({checkAsuransi:false}):
            this.setState({checkAsuransi:true})
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

    renderBankService = ()=>{
        var jsx = this.state.bankService.map((val,index)=>{
                return   (<option key={index} value={val.id}>{val.name}</option>)
        })
        return jsx;
    }

    btnCancel = ()=>{
    this.setState({diKlik:true})
    }

    handleChecked = ()=>{
    this.setState({check:!this.state.check})
    }

    renderBtnSumbit =()=>{
    if( this.state.submit) {
        return <input type="button" disabled className="btn btn-success" value="Simpan" onClick={this.btnSaveProduct} style={{cursor:"wait"}}/>
    }else{
    return <input type="button" className="btn btn-success" value="Simpan" onClick={this.btnSaveProduct}/>
    }
    }
    render(){
        if(this.state.diKlik){
            return <Redirect to='/listproduct'/>            

        }
        if(getToken()){
            return(
                <div className="container">
                    <h2 className="mb-5">Produk - Tambah</h2>
                    <form>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td>
                                   <label>Nama Produk</label>
                                </td>
                                <td>
                                   <input type="text" ref="namaProduct" className="form-control textfield" placeholder="Input Nama Produk" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                   <label>Jangka Waktu (Bulan)</label>
                                </td>
                                <td>
                                <select ref="jangkaWaktuDari" className="form-control option" style={{width:"150px"}}>
                                        <option value={0}> DARI </option>
                                        <option value={6}>6 </option>
                                        <option value={12}>12 </option> 
                                        <option value={18}>18 </option> 
                                        <option value={24}>24 </option>
                                        <option value={30}>30 </option>    
                                        <option value={36}>36 </option>
                                </select>
                              
                                <select  ref="jangkaWaktuSampai" className="form-control option" style={{width:"150px"}}>
                                        <option value={0}>HINGGA</option>
                                        <option value={6}>6 </option>
                                        <option value={12}>12 </option> 
                                        <option value={18}>18 </option> 
                                        <option value={24}>24 </option>
                                        <option value={30}>30 </option>
                                        <option value={36}>36 </option>
                                </select>
                                </td>
                            </tr>
                            <tr>
                                    <td>
                                       <label>Imbal Hasil</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <input type="number" className="form-control" ref="imbalHasil" style={{width:"80px"}} placeholder="0" /><label>%</label>
                                    </div>  
                                    </td>
                            </tr>
                            <tr>
                                    <td>
                                        <label>Rentang Pengajuan</label>
                                    </td>
                                    <td>
                                    <div className="form-inline">
                                        <NumberFormat placeholder="Rp. 0" onValueChange={(values) => {this.setState({rentangDari:values.value})}} className="form-control textfield" ref="rentangDari" thousandSeparator={true} prefix={'Rp. '} />
                                        <label style={{marginLeft:"20px",marginRight:"-95px"}}> s/d </label>
                                        <NumberFormat placeholder="Rp. 0" onValueChange={(values) => {this.setState({rentangAkhir:values.value})}} className="form-control textfield" ref="rentangHingga" thousandSeparator={true} prefix={'Rp. '} />
                                    </div>
                                    </td>

                            </tr>
                            <tr>
                                <td>
                                    <label>Admin fee</label>
                                </td>
                                <td>
                                <div className="form-inline">
                                    <input type="text" className="form-control" ref="adminFee" style={{width:"80px"}} placeholder="0" /><label>%</label>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Convinience Fee</label>
                                </td>
                                <td>
                                <div className="form-inline">
                                    <input type="text" className="form-control" pattern="[0-9.,]+" ref="convinienceFee" style={{width:"80px"}} placeholder="0" /><label>%</label>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                     <label>Layanan</label>
                                </td>
                                <td>
                                    <select ref="layanan" className="form-control">
                                            <option value={0}>Pilih Layanan...</option>
                                           {this.renderBankService()}
                                    </select>
                                </td>

                            </tr>
                         
                            <tr>
                                <td>
                                     <label>Agunan</label>
                                </td>
                                <td>
                             
                                <div className="col-sm-10">
                            <div className="row">
                                <div className="col ">
                              

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" value="Sertifikat Tanah" style={{marginLeft:"110px"}}/>
                                    <label className="form-check-label">Sertifikat Tanah</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" value="Sertifikat Rumah"/>
                                    <label className="form-check-label" >Sertifikat Rumah</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" value="BPKB Kendaraan"/>
                                    <label className="form-check-label">BPKB Kendaraan</label>
                                    </div> 
                                
                                   
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" name="agunan" value="Kios/Lapak" style={{marginLeft:"110px"}}/>
                                    <label className="form-check-label">Kios/ Lapak</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input agunan" type="checkbox" name="agunan" value="Deposito"/>
                                    <label className="form-check-label" >Deposito</label>
                                    </div>

                                    <div className="form-check form-check-inline">
                                    <input className="form-check-input otheragunan" type="checkbox" value="other" />
                                    <label className="form-check-label ">Lainnya</label> 
                                    <input type="text" ref="lainnya" style={{width:"100px"}} placeholder="Lainnya.." className="form-control ml-2"/>
                                    </div> 
                                  
                                </div>
                                
                            </div>
                      
                        </div>
                       
                                    
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <label >Sektor Pembiayaan</label>
                                </td>
                                <td>
                                    <Select
                                        value={this.state.selectedOption}
                                        onChange={this.handleChange}
                                        isMulti={true}
                                        options={options}
                                        styles={customStyles}
                                        placeholder="Jenis Layanan"
                                        
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
                                            <input type="text" onChange={this.handleTextAsuransi} className="ml-2" ref="asuransi"></input>
                               
                                </div>


                                </td>
                            </tr>
                            <tr>
                                <td>
                                     <label >Status</label>
                                </td>
                                <td>
                                <div className="form-check-inline" style={{marginLeft:"125px"}}>
                                            <input className="form-check-input messageCheckbox" type="checkbox" onChange={this.handleChecked} defaultChecked={this.state.check}/>
                                            <label className="form-check-label">{this.state.check ? 'Aktif' : 'Tidak Aktif'}</label>
                                </div> 
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {this.renderBtnSumbit()}
                                    <input type="button" className="btn btn-warning ml-2" value="Batal" onClick={this.btnCancel}/>
                               
                                </td>
                                <td>
                                <div className="form-group row">
                                        <div style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                                {this.state.errorMessage}
                                        </div>
                                            
                                </div>
                                </td>
                            </tr>
                            </tbody>
                            
                        </table>
                        
                    </form>






                </div>
            )
        }
        if(getToken()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default ProductAdd;