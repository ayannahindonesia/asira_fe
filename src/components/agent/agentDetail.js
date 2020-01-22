import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getAgentFunction } from './saga'
import { getToken } from '../index/token';
import { destructAgent, isRoleAccountExecutive } from './function';
import BrokenLink from './../../support/img/default.png'

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

class AgentDetail extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      agentId: 0,
      kategori: 0,
      kategori_name: '',
      dataAgent: {},
      bank_name: '',
      loading: true,
      status: true,
      agentName: '',
      agent_provider_name: '',
      username: '',
      instansi:'',
      phone:'',
      email:'',
      image:''
    };

    componentDidMount(){
      this._isMounted = true;

      this.setState({
        agentId: this.props.match.params.id,
      },() => {
        this.refresh();
      })
      
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function() {
      const param = {
        agentId: this.state.agentId
      };
      const data = await getAgentFunction(param) ;

      if(data) {
        if(!data.error) {
          const dataAgent = destructAgent(data.dataAgent);

          this.setState({
            status: dataAgent.status,
            agentId: dataAgent.id,
            agentName: dataAgent.name,
            username: dataAgent.username,
            phone: dataAgent.phone,
            email: dataAgent.email,
            kategori: dataAgent.category,
            kategori_name: dataAgent.category_name,
            agent_provider_name: dataAgent.agent_provider_name,
            bank_name: dataAgent.banks_name,
            instansi: dataAgent.instansi,
            image:dataAgent.image,
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

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
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
              <h3>Agen - Detail</h3>
                              
              <hr/>
              
              <form>
                <div className="form-group row">   
                  <div className="col-12" style={{color:"red",fontSize:"15px",textAlign:'left', marginBottom:'2vh'}}>
                    {this.state.errorMessage}
                  </div>    
                </div>

                <div className="form-group row" style={{marginBottom:40}}>                
                  <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                    Id Agen
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                    {this.state.agentId}
                  </div>                 
                </div>

                <div className="form-group row" style={{marginBottom:40}}>                
                  <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                    Nama Agen
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                    {this.state.agentName}
                  </div>             
                </div>

                <div className="form-group row" style={{marginBottom:40}}>                
                  <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                    Id Pengguna (username)
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                    { this.state.username }
                  </div>                 
                </div>

                <div className="form-group row" style={{marginBottom:40}}>                   
                  <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                    Email
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                    { this.state.email }
                  </div>                  
                </div>

                <div className="form-group row" style={{marginBottom:40}}>                   
                  <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                    No HP
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                    { this.state.phone }
                  </div>                  
                </div>


                <div className="form-group row" style={{marginBottom:40}}>                   
                  <label className="col-sm-2 col-form-label" style={{height:1.5}}>
                    Kategori
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:1.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:1.5}}>
                    {this.state.kategori_name}
                  </div>                 
                </div>

                
                <div className="form-group row" style={{marginBottom:40}}>                   
                  <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                    Instansi
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                    { this.state.instansi }
                  </div>                 
                </div>
                
 
                {
                  !isRoleAccountExecutive(this.state.kategori) &&
                  <div className="form-group row" style={{marginBottom:40}}>                   
                    <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                      Bank Pelayanan
                    </label>
                    <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                      :
                    </label>
                    <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                      { this.state.bank_name }
                    </div>          
                  </div>
                }
                
                <div className="form-group row">
                  <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                    Status
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                    { this.state.status ? 'Aktif' : 'Tidak Aktif'}
                  </div>   
                </div>

                <div className="form-group row">                
                  <label className="col-sm-2 col-form-label" style={{height:3.5}}>
                    Gambar Agen
                  </label>
                  <label className="col-sm-1 col-form-label" style={{height:3.5}}>
                    :
                  </label>
                  <div className="col-sm-4 col-form-label" style={{height:3.5}}>
                <img src={`${this.state.image}`} width="100px" height="100px" alt="Foto agen" onError={(e)=>{
                e.target.attributes.getNamedItem("src").value = BrokenLink
                }} ></img>
                </div>             
                </div>
                
                <div className="form-group row">
                    <div className="col-sm-12 mt-3">
                       <input type="button" value="Kembali" className="btn" onClick={this.btnCancel} style={{backgroundColor:"grey",color:"white"}}/>
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
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
  // menu: getMenu(),
  // fetching: getFetchStatus(),
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
  )(AgentDetail);