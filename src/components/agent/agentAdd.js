import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import CheckBox from '@material-ui/core/Checkbox';
import DropDown from '../subComponent/DropDown';
import swal from 'sweetalert';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { compose } from 'redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { postAgentAddFunction } from './saga';
import { validateEmail, validatePhone } from '../global/globalFunction';
import { getToken } from '../index/token';
import { getAllBankList } from '../bank/saga';
import { getPenyediaAgentListFunction } from '../penyediaAgent/saga';
import { isRoleAccountExecutive, constructAgent } from './function';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
    textField: {
      border: '1px solid',
    },
  });


class agentAdd extends React.Component{
    _isMounted = false;

    state = {
      selectedFile:'',
      diKlik:false,
      errorMessage:'',
      kategori : 'agent',
      bank: [],
      instansi: 0,
      listKategori:[
        {
          id : 'agent',
          name: 'Agen',
        },
        {
          id : 'account_executive',
          name: 'Account Executive',
        }
      ],
      listPenyediaAgent: [],
      listBank: [],
      loading: true,
      status: true,
      agentName: '',
      username: '',
      phone:'',
      email:'',
    };

    componentDidMount(){
      this._isMounted = true;
      this.refresh()
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    valueHandler = ()=>{
      return  this.state.selectedFile ? this.state.selectedFile.name :"Browse Image"
      
    }
    onChangeHandler = (event)=>{
    //untuk mendapatkan file image
       this.setState({selectedFile:event.target.files[0]})
    }

    refresh = async function() {
      const param = {};
      const data = await getPenyediaAgentListFunction(param, getAllBankList) ;

      if(data) {
        if(!data.error) {
          const listPenyediaAgent = data.dataListAgent.data;
          let instansi = 0;

          for(const key in listPenyediaAgent) {
            if(listPenyediaAgent[key].id) {
              instansi = listPenyediaAgent[key].id
            }
          }

          this.setState({
            listBank: data.bankList.data,
            listPenyediaAgent,
            instansi,
            bank: [],
            loading: false,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }  
    }

    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    btnSave=()=>{
      if (this.validate()) {
        
        const dataAgent = constructAgent(this.state, true);
        const param = {
          dataAgent,
        }
        if (this.state.selectedFile){
            const pic = this.state.selectedFile
            const reader = new FileReader();
            reader.readAsDataURL(pic);
            reader.onload =  () => {   
              var arr = reader.result.split(",")   
              var image = arr[1].toString()
              param.dataAgent.image = image
              
              this.postAgent(param)
            };
            reader.onerror = function (error) {
            this.setState({errorMessage:"Gambar gagal tersimpan"})
            };
        }else{
          this.postAgent(param)
        }
       
        
      }
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    onChangeCheck = (e) => {
      this.setState({
        status: !this.state.status,
      });
    };

    onChangeTextField = (e) => {
      let value = e.target.value;
      let labelName = e.target.id;
      let flag = true;

      if(labelName !== 'agentName' && (value.includes(' ') || value.includes('\'') || value.includes('"') || value.includes(',')) ) {
        flag = false
      }

      if(labelName === 'phone' && isNaN(value)) {    
        flag = false 
      }
      
      if(flag) {
        this.setState({
          [labelName]: value,
        })
      } 
    }

    onChangeDropDown = (e) => {
      const labelName = e.target.name.toString().toLowerCase();
      let instansi = e.target.value;

      if(labelName === 'kategori') {
        if(e.target.value === 'agent') {
          for(const key in this.state.listPenyediaAgent) {
            instansi = this.state.listPenyediaAgent[key].id;
            break;
          }
        } else if(e.target.value === 'account_executive') {
          for(const key in this.state.listBank) {
            instansi = this.state.listBank[key].id;
            break;
          }
        }
        this.setState({instansi})
      }

      this.setState({
        [labelName]: e.target.value,
        bank: [],
      })
    }

    onChangeDropDownMultiple = (e) => {
      const dataBank = this.state.listBank;
      const bank = e.target.value;
      const newBank = [];
      
      for(const key in dataBank) {

        for(const keyBank in bank) {
          if(
            dataBank[key].id.toString().toLowerCase() === bank[keyBank].toString().toLowerCase() || 
            (bank[keyBank].id && dataBank[key].id.toString().toLowerCase() === bank[keyBank].id.toString().toLowerCase())
          ) {
            newBank.push(dataBank[key])
            break;
          }
        }
        
      }

      this.setState({bank : newBank})

    }

    postAgent = async function(param) {
      const data = await postAgentAddFunction(param);

      if(data) {
        if(!data.error) {
          swal("Success","Agen berhasil di tambah","success")
          this.setState({
            diKlik: true,
            loading: false,
          })
        } else {
          this.setState({
            errorMessage: data.error,
            loading: false,
          })
        }      
      }
    }

    handleDelete = (e, value) => {
      const bank = this.state.bank;
      const newBank = [];

      for(const key in bank) {
        if(bank[key].id.toString().toLowerCase() !== value.toString().toLowerCase()) {
          newBank.push(bank[key])
        }
      }

      this.setState({bank : newBank})
    }

    validate = () => {
      let flag = true;
      let errorMessage = '';

      if (!this.state.username || this.state.username.length === 0) {
        flag = false;
        errorMessage = 'Mohon input username dengan benar'
      }
      // else if(!this.state.selectedFile && this.state.selectedFile===null){
      //   flag = false;
      //   errorMessage = 'Mohon input gambar dengan benar'
      // } 
      else if (!this.state.agentName || this.state.agentName.trim().length === 0) {
        flag = false;
        errorMessage = 'Mohon input nama agen dengan benar'
      } else if (!this.state.email || this.state.email.length === 0 || !validateEmail(this.state.email) ) {
        flag = false;
        errorMessage = 'Mohon input email dengan benar'
      } else if (!this.state.phone || this.state.phone.length === 0 || !validatePhone(`62${this.state.phone}`)) {
        flag = false;
        errorMessage = 'Mohon input nomor hp dengan benar'
      } else if (!this.state.instansi || this.state.instansi.length === 0) {
        flag = false;
        errorMessage = 'Mohon input instansi dengan benar'
      }else if (!isRoleAccountExecutive(this.state.kategori) && (!this.state.bank || this.state.bank.length === 0)) {
        flag = false;
        errorMessage = 'Mohon input bank dengan benar'
      } else {
        errorMessage = ''
      }
         
      this.setState({
        errorMessage,
      })

      return flag;
    }

    render(){
        if(this.state.diKlik){
          return <Redirect to='/listAgent'/>            
        } else if (this.state.loading){
          return  (
            <div key="zz">
              <div align="center" colSpan={6}>
                <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
              </div>
            </div>
          )
        } else if(getToken()){
          return(
              <div className="container mt-4">
                <h3>Agen - Tambah</h3>
                                
                <hr/>
                
                <form>
                  <div className="form-group row">   
                    <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left', marginBottom:'2vh'}}>
                      {this.state.errorMessage}
                    </div>    
                  </div>

                  <div className="form-group row" style={{marginBottom:40}}>                
                    <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                      Nama Agen
                    </label>
                    <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4" >
                      <TextField
                        id="agentName"
                        onChange={this.onChangeTextField}
                        value={this.state.agentName}
                        hiddenLabel
                        fullWidth
                        placeholder="Nama Agen"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                 
                  </div>

                  <div className="form-group row" style={{marginBottom:40}}>                
                    <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                      Id Pengguna (username)
                    </label>
                    <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4" >
                      <TextField
                        id="username"
                        onChange={this.onChangeTextField}
                        value={this.state.username}
                        hiddenLabel
                        fullWidth
                        placeholder="Username"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                 
                  </div>

                  <div className="form-group row" style={{marginBottom:40}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:1.5}}>
                      Email
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:1.5}}>
                      :
                    </label>
                    <div className="col-sm-4">
                      <TextField
                        id="email"
                        type="email"
                        onChange={this.onChangeTextField}
                        value={this.state.email}
                        hiddenLabel
                        fullWidth
                        placeholder="Email"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                   
                  </div>

                  <div className="form-group row" style={{marginBottom:20}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:1.5}}>
                      No HP
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:1.5}}>
                      :
                    </label>
                    <div className="col-sm-1" style={{lineHeight:1.5, textAlign:'right', paddingTop:'5px', paddingRight:'0px', paddingLeft:'0px'}}>
                      (+62)
                    </div>
                    <div className="col-sm-3">
                      <TextField
                        id="phone"
                        type="tel"
                        onChange={this.onChangeTextField}
                        value={this.state.phone}
                        hiddenLabel
                        fullWidth
                        placeholder="Nomor Handphone"
                        style={{border:'1px groove', paddingLeft:'5px'}}
                      />
                    </div>                   
                  </div>


                  <div className="form-group row" style={{marginBottom:7}}>                   
                    <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                      Kategori
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4">
                      <DropDown
                        value={this.state.kategori}
                        label="Kategori"
                        data={this.state.listKategori}
                        id="id"
                        labelName={"name"}
                        onChange={this.onChangeDropDown}
                        fullWidth
                      />
                    </div>                 
                  </div>

                  
                    <div className="form-group row" style={{marginBottom:7}}>                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Instansi
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <div className="col-sm-4">
                        <DropDown
                          value={this.state.instansi}
                          label="Instansi"
                          data={isRoleAccountExecutive(this.state.kategori) ? this.state.listBank : this.state.listPenyediaAgent}
                          id="id"
                          labelName={"name"}
                          onChange={this.onChangeDropDown}
                          fullWidth
                        />
                      </div>                 
                    </div>
                  
   
                  {
                    !isRoleAccountExecutive(this.state.kategori) &&
                    <div className="form-group row" style={{marginBottom:15}}>                   
                      <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                        Bank Pelayanan
                      </label>
                      <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                        :
                      </label>
                      <div className="col-sm-4">
                        <DropDown
                          multiple={true}
                          value={this.state.bank}
                          label="Bank"
                          data={this.state.listBank}
                          id="id"
                          onDelete={this.handleDelete}
                          labelName="name"
                          onChange={this.onChangeDropDownMultiple}
                          fullWidth
                        />
                      </div>                 
                    </div>
                  }
                  
                  <div className="form-group row">
                    <label className="col-sm-2 col-form-label" style={{lineHeight:3.5}}>
                      Status
                    </label>
                    <label className="col-sm-1 col-form-label" style={{lineHeight:3.5}}>
                      :
                    </label>
                    <div className="col-4" style={{color:"black",fontSize:"15px",alignItems:'left', paddingTop: '15px'}}>
                      
                      <FormControlLabel
                        control={
                          <CheckBox       
                            color="default"           
                            onChange={this.onChangeCheck}
                            checked={this.state.status}
                            style={{justifyContent:'left'}}
                          />  
                        }
                        label={this.state.status ? "Aktif" : "Tidak Aktif"}
                      />
                      
                    </div>           
                  </div>

                  <div className="form-group row" style={{marginBottom:40}}>                
                    <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                      Upload Gambar
                    </label>
                    <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4" >
                       <input className="btn btn-primary" type="button" onClick={()=>this.refs.input.click()} value={this.valueHandler()}></input>
                       <input ref="input" style={{display:"none"}} type="file" accept="image/*" onChange={this.onChangeHandler}></input> 
                    </div>                 
                  </div>
                  
                  <div className="form-group row">
                      <div className="col-sm-12 ml-3 mt-3">
                        <input type="button" value="Simpan" className="btn btn-success" onClick={this.btnSave} />
                        <input type="button" value="Batal" className="btn ml-2" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
                      </div>
                  </div>
                  
                </form>
              
              </div>
          )
        } else if(getToken()){
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
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(agentAdd);