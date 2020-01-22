import React from 'react'
import swal from 'sweetalert'
import Loader from 'react-loader-spinner'
import { editLayananFunction, getDetailLayananFunction } from './saga'
import { Redirect } from 'react-router-dom'
import './../../support/css/layananAdd.css'
import { getToken } from '../index/token';



class LayananEdit extends React.Component{
    state={
        selectedFile:null,
        base64img:null,
        errorMessage:'',
        diKlik:false,
        rows:[],
        imageVal:'',
        check: true,
        loading:true,
        submit:false
    }
    _isMounted = false;

    componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
    componentDidMount(){
        this._isMounted=true
        this.getLayananEdit()
    }
    componentWillUnmount(){
        this._isMounted=false
    }

    getLayananEdit = async function(){
        const id = this.props.match.params.id
        const data = await getDetailLayananFunction({id})

        if(data){
            if(!data.error){
                this.setState({rows:data.data,imageVal:data.data.image,loading:false, check: data.data && data.data.status && data.data.status ==='active' ? true : false})
            }else{
                this.setState({errorMessage:data.error,loading:false})
            }
        }
    }

    onChangeHandler = (event)=>{
        //untuk mendapatkan file image
        this.setState({selectedFile:event.target.files[0]})
    }
    valueHandler = ()=>{
        return  this.state.selectedFile ? this.state.selectedFile.name :"Browse Image"
        
    }
    getBase64(file,callback) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            callback(reader.result.replace("data:image/jpeg;base64,",""))
        };
        reader.onerror = function (error) {
          this.setState({errorMessage:"Gambar gagal tersimpan"})

        };
     }

    btnEditLayanan = ()=>{
        
        var name = this.refs.namaLayanan.value ? this.refs.namaLayanan.value : this.refs.namaLayanan.placeholder
        var status = this.state.check ? "active": "inactive"
        this.setState({submit:true})
        if(name.trim()===""||name===""){
            this.setState({errorMessage:"Nama Layanan Kosong - Harap Cek Ulang",submit:false})
        }else{
            if (this.state.selectedFile){
                if (this.state.selectedFile.size >1000000){
                    this.setState({errorMessage:"Gambar tidak bole lebih dari 1 MB - Harap cek ulang",submit:false})
                }else{
                    var pic = this.state.selectedFile
                    var reader = new FileReader();
                    reader.readAsDataURL(pic);
                    reader.onload =  () => {           
                        var arr = reader.result.split(",")   
                        var image = arr[1].toString()
                        var newData = {name,image,status}
                        const param ={
                            id:this.props.match.params.id,
                            newData
                        }
                        this.editLayananBtn(param)
                    };
                    reader.onerror = function (error) {
                        this.setState({errorMessage:"Gambar gagal tersimpan"})

                    };
                }
             
            }else{
                var newData = {name,status}
                const param ={
                    id:this.props.match.params.id,
                    newData
                }
                this.editLayananBtn(param)
            }
        }
    }
    editLayananBtn = async function (param){
        const data = await editLayananFunction (param)
        if(data){
            if(!data.error){
                swal("Success","Layanan berhasil di Edit","success")
                this.setState({errorMessage:null,diKlik:true})
            }else{
                this.setState({errorMessage:data.error,submit:false})
            }
        }
    }
    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    handleChecked = () => {
        this.setState({check : !this.state.check})
    }

    renderBtnSumbit =()=>{
        if( this.state.submit) {
            return <input type="button" disabled className="btn btn-success ml-3 mr-3" value="Ubah" onClick={this.btnEditLayanan} style={{cursor:"wait"}}/>
        }else{
            return   <input type="button" className="btn btn-success ml-3 mr-3" value="Ubah" onClick={this.btnEditLayanan}/>
     
        }
     }

    render(){
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
        if(this.state.diKlik){
            return <Redirect to='/listlayanan'/>            

        }
        if(getToken()){
            return(
                <div className="container">
                   <h2 className="mt-3">Layanan - Ubah</h2>
                  
                   <hr/>
                   <div className="form-group row">
                            <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'center'}}>
                                    {this.state.errorMessage}
                            </div>   
                    </div>
                   <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Nama Layanan</label>
                            <div className="col-sm-9">
                            <input disabled type="text" placeholder={this.state.rows.name} style={{width:"50%",marginLeft:"13%"}} className="form-control" ref="namaLayanan"></input>                            
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Gambar</label>
                            <div className="col-sm-9">
                            <input className="AddStyleButton btn btn-primary" type="button" onClick={()=>this.refs.input.click()} value={this.valueHandler()}></input>
                            <input ref="input" style={{display:"none"}} type="file" accept="image/*" onChange={this.onChangeHandler}></input>
                            <img alt={this.state.rows.name} style={{marginLeft:"20px",width:"100px"}} src={this.state.imageVal}></img>
                            </div>
                    </div>
                    <div className="form-group row">
                            <label className="col-sm-3 col-form-label">Status</label>
                            <div className="col-sm-9">
                            <input className="form-check-input messageCheckbox AddStyleButtonCheckbox" type="checkbox" onChange={this.handleChecked} checked={this.state.check} /> 
                            <label style={{position:"relative",left:"18%",paddingTop:"3px"}}>{this.state.check ? 'Aktif' : 'Tidak Aktif'}</label>           
                            </div>
                    </div>
                    <div className="form-group row">
                            {this.renderBtnSumbit()}
                            <input type="button" className="btn btn-warning" value="Batal" onClick={this.btnCancel}/>

                    </div>
                </div>
            )
        }
        if(!getToken()){
       
            return (
                <Redirect to='/login' />
            )    
        }
       
    }}
}

export default LayananEdit;