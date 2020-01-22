import React from 'react'
import { Redirect } from 'react-router-dom'
import Select from 'react-select';
import swal from 'sweetalert'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { getProvinsiFunction, getKabupatenFunction, getBankDetailFunction, getBankTypesFunction, editBankFunction } from './saga';
import { listProductFunction } from './../product/saga'
import { getToken } from '../index/token';
import { getAllLayananListFunction } from '../layanan/saga';
import BrokenLink from './../../support/img/default.png'

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

class BankEdit extends React.Component{
    _isMounted=false;
    state = {
        selectedFile:null,
        productSelected:[],
        errorMessage: null, diKlik:false,
        typeBank:[],bankService:[],bankProduct:[],
        provinsi:[],kabupaten:[],idProvinsi:null,dataBank:[],phone:'',provinsiEdit:null,namaTipeBank:'',adminFeeRadioValue:'',convinienceFeeRadioValue:'',
        serviceName:[],productName:[],submit:false
    };
    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    handleChangejenisLayanan = (jenisLayanan) => {
        this.setState({ serviceName:jenisLayanan , productName: []}, (() => {
            this.getBankProduct(this.handleServiceString(jenisLayanan))
        }));

    };

    handleChangejenisProduct = (jenisProduct) => {
        this.setState({ productName:jenisProduct });
    };

    componentDidMount(){
        this._isMounted=true
        this.getAllProvinsi()
        this.getBankDataById()

    }
    componentWillUnmount(){
        this._isMounted=false
    }

    getAllProvinsi = async function(){
        const data = await getProvinsiFunction()
        
        if(data){
            if(!data.error){
                this.setState({provinsi:data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    getAllKabupaten = async function (params) {
        const data = await getKabupatenFunction(params)
        if(data){
            if(!data.error){
                this.setState({kabupaten:data, provinsiEdit:true})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    getBankProduct = async function (stringServiceId) {
        const param ={
            service_id: stringServiceId || '',
        }

        const data = await listProductFunction(param)
        if (data){
            if(!data.error){
                const dataProductList = data.productList.data || [];
                const newProduct =[]
                const productSelected =[]
                
                for(const key in dataProductList){
                    for (const keyValue in this.state.productName){
                        
                        if (this.state.productName[keyValue].toString() === dataProductList[key].id.toString()) {
                            productSelected.push({
                                key: dataProductList[key].id,
                                value: dataProductList[key].id,
                                label: `${dataProductList[key].name} [${this.findServiceName(dataProductList[key].service_id.toString())}]`,
                            })
                            break;
                        }
                    }

                    newProduct.push({
                        key:dataProductList[key].id,
                        value:dataProductList[key].id,
                        label:`${dataProductList[key].name} [${this.findServiceName(dataProductList[key].service_id.toString())}]`
                    })
                }
                
                this.setState({bankProduct:newProduct, productName: productSelected})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    getBankService = async function () {
        const data = await getAllLayananListFunction({})

        if(data){
            if(!data.error){
                const dataListService = data.listLayanan.data || [];
                const newService = [];
                const newValueService = [];

                for(const key in dataListService) {
                    for(const keyValue in this.state.serviceName) {
                        if (this.state.serviceName[keyValue].toString() === dataListService[key].id.toString()) {
                            newValueService.push({
                                key: dataListService[key].id,
                                value: dataListService[key].id,
                                id: dataListService[key].id,
                                label: dataListService[key].name, 
                            })
                            break;
                        }
                    }
                    newService.push(
                        {
                           key: dataListService[key].id,
                           id: dataListService[key].id,
                           value: dataListService[key].id,
                           label: dataListService[key].name, 
                        }
                    )
                }
                
                this.setState(
                    {bankService:newService, serviceName:newValueService},()=>{
                        this.getBankProduct(this.handleServiceString(this.state.serviceName))
                    }
                )
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    } 

    handleServiceString = (arrayService) => {
        let stringService = '';

        for(const key in arrayService) {
            if(key.toString() !== '0') {
                stringService += ', '
            }
            if(arrayService[key] && arrayService[key].value) {
                stringService += `${arrayService[key].value}`
            }
        }

        return stringService;
    }


    getBankDataById = async function (){
        const param = {
            id:this.props.match.params.id
        }

        const data = await getBankDetailFunction(param)

        if(data){
            if(!data.error){
                this.setState({dataBank:data,productName:data.products,serviceName:data.services})
                if (this.state.dataBank){
                  this.getTypeBank()
                  this.getBankService()
                }
            }else{
                this.setState({errorMessage:data.error})
            }
        }

    }

    getTypeBank = async function (){
        const param = {
            type: this.state.dataBank.type
        }
        const data = await getBankTypesFunction(param)

        if(data){
            if(!data.error){
                this.setState({namaTipeBank:data.data.name})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
   
    }

    renderProvinsiJsx = ()=>{
        var jsx = this.state.provinsi.map((val,index)=>{
            return (
                <option key={index} value={val.id+"-"+val.name} > {val.name} </option>
                
            )
        })
        return jsx
    }
    renderKabupatenJsx = ()=>{
        var jsx = this.state.kabupaten.map((val,index)=>{
            return (
                <option key={index} value={val.name}>{val.name}</option>
            )
        })
        return jsx
    }


    findServiceName = (service_id) => {
        let stringService = '';
        
        for(const key in this.state.serviceName) {
            if(this.state.serviceName && this.state.serviceName[key] && this.state.serviceName[key].value.toString() === service_id.toString()) {
                stringService = this.state.serviceName[key].label
            }
        }
        
        return stringService;
    }

    handleChangeRadioAdmin =(e)=>{
        this.setState({adminFeeRadioValue:e.target.value})
    }
    handleChangeRadioConvience =(e)=>{
        this.setState({convinienceFeeRadioValue:e.target.value})
    }

    renderBtnSumbit =()=>{
        if( this.state.submit) {
         return <input type="button" disabled className="btn btn-primary" value="Simpan" onClick={this.btnEdit} style={{cursor:"wait"}}/>
        }else{
        return <input type="button" className="btn btn-primary" value="Simpan" onClick={this.btnEdit}/>
        }
     }
    btnEdit = ()=>{
        var services =[]
        var products =[]
        var id=this.refs.idBank.value
        var name = this.refs.namaBank.value
        var type = parseInt(this.refs.tipeBank.value)
        var address = this.refs.alamat.value ? this.refs.alamat.value:this.refs.alamat.placeholder
        var province = this.refs.provinsi.value.includes("-") ? this.refs.provinsi.value.slice(this.refs.provinsi.value.indexOf('-')+1,this.refs.provinsi.value.length) : this.refs.provinsi.value
        var city = this.refs.kota.value.includes("-") ? this.refs.kota.value.slice(this.refs.provinsi.value.indexOf('-')+1,this.refs.provinsi.length):this.refs.kota.value
        var pic = this.refs.pic.value ? this.refs.pic.value:this.refs.pic.placeholder
        var phone = this.state.phone ? String(this.state.phone):String(this.state.dataBank.phone)
        var adminfee_setup = this.state.adminFeeRadioValue ? this.state.adminFeeRadioValue : this.state.dataBank.adminfee_setup
        var convfee_setup =  this.state.adminFeeRadioValue ? this.state.adminFeeRadioValue : this.state.dataBank.adminfee_setup
       

        if(city === "0" || city === null){
            this.setState({errorMessage:"Kota Kosong - Harap cek ulang"})
        }else if (pic.trim()===""){
            this.setState({errorMessage:"PIC Kosong - Harap cek ulang"})
        }else if(address.trim()===""){
            this.setState({errorMessage:"Alamat Kosong - Harap cek ulang"})
        }else{
            this.setState({submit:true})
             if(this.state.serviceName){
                for (var i=0; i<this.state.serviceName.length;i++){
                    services.push (this.state.serviceName[i].value)
                }
            }else{
                services = []
            }
            
            if(this.state.productName){
                for ( i=0; i<this.state.productName.length;i++){
                    products.push (this.state.productName[i].value)
                }
            }else{
                products = []
            }
            if(this.state.selectedFile){
                var picture = this.state.selectedFile
                var reader = new FileReader();
                reader.readAsDataURL(picture);
    
                reader.onload =  () => {   
                    var arr = reader.result.split(",")   
                    var image = arr[1].toString()
                    
                    var newData = {
                        name,type,address,province,city,services,products,pic,phone,adminfee_setup,convfee_setup,image
                    }
                    const param = {
                        id:id,
                        newData
                    }
               
                    this.editBankBtn(param)
                };
                reader.onerror = function (error) {
                  this.setState({errorMessage:"Gambar gagal tersimpan"})
                };
            }else{
                var newData = {
                    name,type,address,province,city,services,products,pic,phone,adminfee_setup,convfee_setup
                }
                const param = {
                    id:id,
                    newData
                }
           
                this.editBankBtn(param)
            }
          

            
           
       }
    }

    editBankBtn = async function (param){
        const data = await editBankFunction(param)
        if(data){
            if(!data.error){
                swal("Success","Data berhasil di edit","success")
                this.setState({diKlik:true,errorMessage:null,submit:false})
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    //=====================================GAMBAR====================
    
    valueHandler = ()=>{
        return  this.state.selectedFile ? this.state.selectedFile.name :"Pilih Gambar"
    }

    onChangeHandler = (event)=>{
        //untuk mendapatkan file image
        this.setState({selectedFile:event.target.files[0]})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/listbank'/>            
        }
        if(getToken()){
            return(
                <div className="container">
                   <h2>Bank - Edit</h2>
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>
                     </div>
                   
                   <form>
                       <fieldset disabled>
                       <div className="form-group row">
                            <label className="col-sm-5 col-form-label">Logo Bank</label>
                            <div className="col-sm-5">
                            <img src={`${this.state.dataBank.image}`} width="100px" height="100px" alt="Foto agen" onError={(e)=>{
                            e.target.attributes.getNamedItem("src").value = BrokenLink
                            }} ></img>                    

                            </div>
                        </div>
                       <div className="form-group row">
                            <label className="col-sm-2 col-form-label">ID Bank</label>
                            <div className="col-sm-10">
                            <input type="text" name="idBank" className="form-control" ref="idBank" defaultValue={this.state.dataBank.id} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama Bank</label>
                            <div className="col-sm-10">
                            <input type="text" name="namaBank" className="form-control" ref="namaBank" defaultValue={this.state.dataBank.name}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Tipe Bank</label>
                            <div className="col-sm-10">
                            <input type="text" name="tipeBank" className="form-control" ref="tipeBank"  defaultValue={this.state.namaTipeBank}/>
                            </div>
                        </div>
                       </fieldset>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Alamat Bank</label>
                            <div className="col-sm-10">
                            <textarea rows="6" ref="alamat" placeholder={this.state.dataBank.address} className="form-control"  autoFocus/>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Provinsi</label>
                            <div className="col-sm-10">
                            <select id="provinsi" onChange={()=>{this.getAllKabupaten(this.refs.provinsi.value.slice(0,this.refs.provinsi.value.indexOf('-')))
                            document.getElementById("kota").value ="0"
                        }} ref="provinsi" className="form-control">
                           
                               {this.state.provinsiEdit===null?     <option value={this.state.dataBank.province}>{this.state.dataBank.province}</option>:null} 
                               <optgroup label="_________________________">
                               {this.renderProvinsiJsx()}
                               </optgroup>
                            </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Kota</label>
                            <div className="col-sm-10">
                            <select ref="kota" id="kota" className="form-control">
                              {this.state.provinsiEdit===null? <option value={this.state.dataBank.city}>{this.state.dataBank.city}</option>:
                           null
                            }  <option value={0}>========= PILIH KOTA =========</option>
                               
                                {this.renderKabupatenJsx()}
                           
                            </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Admin Fee Setup</label>
                            <div className="col-sm-10">
                                {this.state.dataBank.adminfee_setup === 'beban_plafon' ?
                                <label className="form-control" style={{border:"none"}}>
                                    <input type="radio" name="adminfeeSetup"  value="potong_plafon" onClick={this.handleChangeRadioAdmin} /> Potong dari plafond
                                    <input type="radio" name="adminfeeSetup" defaultChecked={true} className="ml-3" value="beban_plafon" onClick={this.handleChangeRadioAdmin} /> Bebankan ke cicilan
                                </label> 
                                    :
                                <label className="form-control" style={{border:"none"}}>
                                    <input type="radio" name="adminfeeSetup" defaultChecked={true} value="potong_plafon" onClick={this.handleChangeRadioAdmin} /> Potong dari plafond
                                    <input type="radio" name="adminfeeSetup"  className="ml-3" value="beban_plafon" onClick={this.handleChangeRadioAdmin} /> Bebankan ke cicilan
                                </label> 
                                }
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Convinience Fee Setup</label>
                            <div className="col-sm-10">
                                <div className="form-control" style={{border:"none",cursor: "not-allowed"}}>
                                    <input type="radio" disabled="disabled" checked={this.state.adminFeeRadioValue==="potong_plafon"?"checked":""} name="convinienceFeeSetup" readOnly value="potong_plafon"  /> Potong dari plafond
                                    <input type="radio" disabled="disabled" checked={this.state.adminFeeRadioValue==="beban_plafon"?"checked":""} name="convinienceFeeSetup" readOnly className="ml-3" value="beban_plafon" /> Bebankan ke cicilan
                                </div> 
                         
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Layanan</label>
                           
                            <div className="col-sm-10" >
                            <Select
                                value={this.state.serviceName}
                                onChange={this.handleChangejenisLayanan}
                                isMulti={true}
                                options={this.state.bankService}
                                styles={customStyles}
                                
                            />
                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Jenis Produk</label>
                            <div className="col-sm-10">
                                <div>
                            <Select
                                value={this.state.productName}
                                onChange={this.handleChangejenisProduct}
                                isMulti={true}
                                options={this.state.bankProduct}
                                styles={customStyles}
                            />

                        </div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Nama PIC</label>
                            <div className="col-sm-10">
                            <input type="text" className="form-control" ref="pic" placeholder={this.state.dataBank.pic} />                            
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">No Telp</label>
                            <div className="col-sm-10">
                          
                            <PhoneInput
                            country="ID"
                            ref="telp"
                            placeholder={this.state.dataBank.phone} 
                            value={ this.state.phone }
                            onChange={ phone => this.setState({ phone }) } className="form-control" />                                                       
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label">Gambar</label>
                            <div className="col-sm-10">
                            <input className="AddStyleButton btn btn-primary" type="button" onClick={()=>this.refs.input.click()} value={this.valueHandler()}></input>
                            <input ref="input" style={{display:"none"}} type="file" accept="image/*" onChange={this.onChangeHandler}></input>             
                            </div>
                    </div>
                        {this.renderBtnSumbit()}
                       
                        <input type="button" className="btn btn-secondary ml-2" value="Batal" onClick={()=>this.setState({diKlik:true})}/>

                   </form>
    
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

export default BankEdit;