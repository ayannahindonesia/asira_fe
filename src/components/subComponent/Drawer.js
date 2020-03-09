import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import PageNotFound from './../404'
import Login from './../index/login'
import Home from './../index/main'
import Nasabah from './../profileNasabah/profileNasabah'
import profileNasabahDetail from './../profileNasabah/profileNasabahDetail'
import PermintaanPinjaman from './../permintaanPinjaman/permintaanPinjaman'
import PermintaanPinjamanDetail from './../permintaanPinjaman/permintaanPinjamanDetail'
import PinjamanSetuju from './../permintaanPinjaman/pinjamanSetuju'
import PinjamanRejected from './../permintaanPinjaman/pinjamanRejected'
import PencairanList from './../pencairan/pencairanList'
import PencairanDetail from './../pencairan/pencairanDetail'
import CalonNasabahList from './../calonNasabah/calonNasabahList';
import calonNasabahDetail from './../calonNasabah/calonNasabahDetail';
import {Route,Switch} from 'react-router-dom'
import { checkPermission } from './../global/globalFunction';
import  globalConstant  from './../global/globalConstant';
import { getTokenClient, getProfileUser } from './../index/token';
import { Grid, Typography } from '@material-ui/core';
import {Link} from 'react-router-dom'

import ProductList from './../product/product'
import ProductDetail from './../product/productDetail'

import ServiceList from './../layanan/layanan'
import ServiceDetail from './../layanan/layananDetail'

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    backgroundColor: '#2076B8',
    fontSize:'12px',
    color: 'white',
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    backgroundColor: 'transparent',
    color: 'white',
    shadow: 'rgba(0,0,0,0)',
    [theme.breakpoints.up('sm')]: {
      width: `0px`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    backgroundColor: '#2076B8',
    fontSize:'12px',
    color: 'white',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  textColorHeader: {
    '&:hover': {
      opacity: "100%",
    },
    fontSize:'14px',
    opacity: "100%",
    color:'white',
  },

  textColorChild: {
    paddingLeft: theme.spacing(4),
    '&:hover': {
      opacity: "100%",
    },
    fontSize:'12px',
    opacity: "100%",
    color:'white',
  },
}));

function ResponsiveDrawer(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const setBank = (lenderProfile) => {
    const bank = lenderProfile && JSON.parse(lenderProfile)
    return bank
  }
  const [bank,] = React.useState(setBank(getProfileUser()));

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  
  const menu = globalConstant.dataMenu;

  const handleOpenMenu = (menu) => {
    const arrayMenu = [];
    for(const key in menu) {
      if(!arrayMenu[menu[key].label]) {
        arrayMenu[menu[key].label] = false;
      }
    }
    
    return arrayMenu
  }


  const [open, setOpen] = React.useState(handleOpenMenu(globalConstant.dataMenu));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const checkOpen = (label) => {
    return open[label];
  }

  const handleClick = (label) => {
    open[label] = !open[label];
    setOpen(open);
    forceUpdate()
  };

  const logOutBtn = () =>{ 
    localStorage.clear();
  }

  const drawer = (
    <div>
      <List style={{padding:0}}>
        <Link to={'/'}  style={{textDecoration:'none', color:'white'}}>
          <ListItem style={{paddingTop:'10%',paddingLeft:'38%', backgroundColor:'#196197'}}>
            <ListItemText style={{minWidth:30}} primary=
            {
              <Typography style={{textAlign:'center', borderRadius:'3px', backgroundColor:'white', height:'50px', width:'50px'}}>
                { bank.image && <img src={`${bank.image}`} alt='' style={{textAlign:'center', borderRadius:'3px', backgroundColor:'white', height:'50px', width:'50px'}} />}
              </Typography>
            }
            />
          </ListItem>
          <ListItem style={{backgroundColor:'#196197',padding:0, paddingBottom:'5%'}}>       
            <ListItemText primary={<Typography style={{textAlign: 'center',fontSize:'16px'}}> {bank.name} </Typography>} />
          </ListItem>
        </Link>
        {
          
          menu.map((menuParent, index) => {
            if (checkPermission(menuParent.permission)) {
              if(!menuParent.child) {
                return (
                  <div key={`${menuParent.label}-${index}`} className={classes.textColorHeader} >
                    <Link to={menuParent.link || '/'}  style={{textDecoration:'none', color:'white'}}>
                      <ListItem button onClick={menuParent.permission === 'keluar' ? logOutBtn : null}>
                        <ListItemIcon style={{minWidth:30}}>{menuParent.logo && <img src={require(`./../../icons/${menuParent.logo}`)} alt='' style={{maxWidth:20, height: 'auto'}} />}</ListItemIcon>
                        <ListItemText primary={<Typography style={{fontSize:'14px'}}> {menuParent.label} </Typography>} />
                      </ListItem>
                    </Link>
                  </div>
                  
                )
              } else {
                return(
                  <div key={menuParent.label}>
                    <ListItem button onClick={() => handleClick(menuParent.label)} className={classes.textColorHeader}>
                      <ListItemIcon style={{minWidth:30}}>{menuParent.logo && <img src={require(`./../../icons/${menuParent.logo}`)} alt='' style={{maxWidth:20, height: 'auto'}} />}</ListItemIcon>
                      <ListItemText primary={<Typography style={{fontSize:'14px'}}> {menuParent.label} </Typography>} />
                      {checkOpen(menuParent.label) ? <ExpandLess /> : <ExpandMore />}
                    
                    </ListItem>
                    <Collapse in={checkOpen(menuParent.label)} timeout="auto" unmountOnExit>
                      <List disablePadding>
                        {
                          menuParent.child.map((menuChild) => {
                            if(checkPermission(menuChild.permission)) {
                              return(
                                <div key={`${menuChild.label}-${index}`} className={classes.textColorChild} >
                                  <Link to={menuChild.link || '/'}  style={{textDecoration:'none', color:'white'}}>
                                    <ListItem button >
                                      <ListItemIcon style={{minWidth:30}}>{menuChild.logo && <img src={require(`./../../icons/${menuChild.logo}`)} alt='' style={{maxWidth:20, height: 'auto'}} />}</ListItemIcon>
                                      <ListItemText primary={<Typography style={{fontSize:'12px'}}> {menuChild.label} </Typography> } />
                                    </ListItem>
                                  </Link>
                                </div>
                              );
                            }

                            return null;

                          }, this)
                        }
                        
                      </List>
                    </Collapse>
                  </div>
                  
                );
              }
            }

            return null;
            

            
          }, this)
        }
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon style={{backgroundColor:'#2076B8', borderRadius:'3px'}} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
            
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            
            {drawer}

          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        {/* <div className={classes.toolbar} /> */}
        <Grid item xs={12} sm={12} style={{padding:'25px 25px 10px'}}>
          <Switch> 
              <Route path='/' component={Home} exact></Route>
              { checkPermission('lender_borrower_list') && <Route path='/profileNasabah' component={Nasabah}></Route>}
              { checkPermission('lender_borrower_list_detail') && <Route path="/profileNasabahDetail/:id" component={profileNasabahDetail}></Route>}
              { checkPermission('lender_loan_request_list') && <Route path="/permintaanpinjaman" component={PermintaanPinjaman}></Route>}
              { checkPermission('lender_loan_request_detail') && <Route path="/permintaanpinjamanDetail/:idLoan" component={PermintaanPinjamanDetail}></Route>}
              { checkPermission('lender_loan_request_list') && <Route path='/pinjamansetuju' component={PinjamanSetuju}></Route>}
              { checkPermission('lender_loan_request_list') && <Route path='/pinjamanrejected' component={PinjamanRejected}></Route>}
              { checkPermission('lender_loan_request_list') && <Route path='/pencairanList' component={PencairanList}></Route>}
              { checkPermission('lender_loan_request_detail') && <Route path='/pencairanDetail/:idLoan' component={PencairanDetail}></Route>}
              { checkPermission('lender_borrower_list') && <Route path='/listCalonNasabah' component={CalonNasabahList}></Route>}
              { checkPermission('lender_borrower_list_detail') && <Route path='/detailCalonNasabah/:id' component={calonNasabahDetail}></Route>}

              { getTokenClient() && getProfileUser() ?  <Route path="/login" component={Home}></Route>:  <Route path="/login" component={Login}></Route>} 
              <Route path='/product' component={ProductList} />
              <Route path='/productDetail/:id' component={ProductDetail} />

              { checkPermission('lender_service_list') && <Route path='/layanan' component={ServiceList}></Route>}
              { checkPermission('lender_service_list_detail') && <Route path='/layananDetail/:id' component={ServiceDetail}></Route>}


              <Route path='*' component={PageNotFound} />
          </Switch>
        
        </Grid>

        <Grid item xs={12} sm={12} style={{textAlign:'right', paddingRight:'30px'}}>
          <img src={require('./../../icons/powered.svg')} alt='Ayannah' style={{width:'auto',maxHeight:50}}/>
        </Grid>

      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element),
};


export default ResponsiveDrawer;