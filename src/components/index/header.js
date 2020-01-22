import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem 
} from 'reactstrap';
import Logo from './../../support/img/logo.jpeg'
import {Link,Redirect} from 'react-router-dom'
import './../../support/css/header.css'
import {connect} from 'react-redux'
import {resetUser} from './../../1.actions/index'
import {checkPermission} from './../global/globalFunction'


class Example extends React.Component {
  state={
    isLogin:false
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: true
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  //Button log out function  
  logOutBtn =()=>{ 
    this.props.resetUser();
    localStorage.clear();
    this.setState({isLogin:true})
  }
  
  render() {
    if(this.state.isLogin){
      return(
        <Redirect to='/' />
      )
    }

    return (
      <div className="sideBar">
        <Navbar>
          
          <img src={Logo} alt="Logo" width="100%" className="mb-4" />
         
          <NavbarToggler onClick={this.toggle} style={{display:"none"}}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              
            { checkPermission(['core_bank_new','core_bank_list']) && 
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-university"></i> Bank</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_bank_new') && <Link to="/tambahbank" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('core_bank_list') && <Link to="/listbank" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem>   </Link>}             
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            { checkPermission('core_borrower_get_all') && 
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-users"></i> Nasabah</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_borrower_get_all') && <Link to="/profileNasabah" style={{color:"inherit",textDecoration:"none"}} ><DropdownItem>Nasabah List</DropdownItem></Link>}
                  { checkPermission('core_borrower_get_all') && <Link to="/listCalonNasabah" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Calon Nasabah List</DropdownItem></Link>}    
                  { checkPermission('core_borrower_get_all') && <Link to="/listCalonNasabahArsip" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Calon Nasabah Arsip List</DropdownItem></Link>}           
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            
            { checkPermission('core_loan_get_all') && <Link to="/permintaanpinjaman"><label><i className="fas fa-hand-holding-usd"></i> Pinjaman</label></Link>}
            
            { checkPermission(['core_service_new','core_service_list']) && 
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-concierge-bell"></i> Layanan</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_service_new') && <Link to="/tambahlayanan" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('core_service_list') && <Link to="/listlayanan" style={{color:"inherit",textDecoration:"none"}}> <DropdownItem>List</DropdownItem></Link> }               
                </DropdownMenu>
              </UncontrolledDropdown>
            }
            
            { checkPermission(['core_product_new','core_product_list']) &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                <label><i className="fas fa-money-check-alt"></i> Product</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_product_new') && <Link to="/tambahproduct" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah </DropdownItem></Link>}                 
                  { checkPermission('core_product_list') && <Link to="/listproduct" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem>  </Link>}                                 
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            { checkPermission(['core_bank_type_new','core_bank_type_list']) &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-sliders-h"></i> Tipe Bank</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_bank_type_new') && <Link to="/tambahtipe" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                  
                  { checkPermission('core_bank_type_list') && <Link to="/listtipe" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem></Link>}                
                </DropdownMenu>
              </UncontrolledDropdown>
            }
              
            { checkPermission(['core_loan_purpose_new','core_loan_purpose_list']) &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-bullseye"></i> Tujuan</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_loan_purpose_new') && <Link to="/tambahtujuan" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link> }                  
                  { checkPermission('core_loan_purpose_list') && <Link to="/listtujuan" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem></Link> }              
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            { checkPermission(['core_role_new','core_role_list']) &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-user-cog"></i> Role</label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_role_new') && <Link to="/tambahrole" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>     }              
                  { checkPermission('core_role_list') && <Link to="/listrole" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link>   }             
                </DropdownMenu>
              </UncontrolledDropdown> 
            }        

            { checkPermission(['core_permission_new','core_permission_list']) &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-user-tag"></i> Role Permission </label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_permission_new') && <Link to="/tambahRolePermission" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('core_permission_list') && <Link to="/listRolePermission" style={{color:"inherit",textDecoration:"none"}}>  <DropdownItem>List </DropdownItem>   </Link> }               
                </DropdownMenu>
              </UncontrolledDropdown>    
            }

            { checkPermission(['core_user_new','core_user_list']) &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-user"></i> Akun </label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_user_new') && <Link to="/tambahUser" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('core_user_list') && <Link to="/listUser" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem></Link> }               
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            { checkPermission(['core_agent_provider_new','core_agent_provider_list']) &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label> <i className="fas fa-building"></i> Penyedia Agen </label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_agent_provider_new') && <Link to="/penyediaAdd" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('core_agent_provider_list') && <Link to="/penyediaList" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem></Link> }               
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            { checkPermission(['core_agent_new','core_agent_list']) &&
              <UncontrolledDropdown  nav inNavbar>
                <DropdownToggle nav caret style={{ color:"inherit",textDecoration:"none"}}>
                  <label><i className="fas fa-user-secret"></i> Agen </label>
                </DropdownToggle>
                <DropdownMenu className="menuDropDown" style={{border:"1px solid black",marginBottom:"20px"}}>
                  { checkPermission('core_agent_new') && <Link to="/tambahAgent" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>Tambah</DropdownItem></Link>}                   
                  { checkPermission('core_agent_list') && <Link to="/listAgent" style={{color:"inherit",textDecoration:"none"}}><DropdownItem>List </DropdownItem></Link> }               
                </DropdownMenu>
              </UncontrolledDropdown>
            }
            
            
            { checkPermission('convenience_fee_report') && <Link to="/report" style={{marginBottom:"10px"}}><label><i className="far fa-newspaper"></i> Report</label></Link>}
           
        
            <p style={{ cursor:"pointer"}} onClick={this.logOutBtn}><label><i className="fas fa-sign-out-alt"></i> Log Out</label></p>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProp = (state)=>{
  return{
      name:state.user.name,
      address:state.user.address
  }
  
}

export default connect(mapStateToProp,{resetUser})(Example)