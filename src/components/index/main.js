import React from 'react'
import { Redirect } from 'react-router-dom'
import { getTokenClient, getProfileUser } from './token';
import { Grid } from '@material-ui/core';
import TitleBar from '../subComponent/TitleBar';

class Main extends React.Component{
    constructor(props) {
        super(props);
    
        this.state = {
          isOpen: true,
          isLogin:false,
          bankName: '',
          bankImage: '',
        };
    }
    
    componentDidMount() {

        if(getProfileUser()) {
            const bank = JSON.parse(getProfileUser()) ;
            this.setState({bankName: bank.name, bankImage: bank.image})
        }
    }

    render(){
        if(getTokenClient()){
            return(
                <Grid container className="containerDetail">

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={'Mitra Dashboard'}
                        />

                    </Grid>
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'13%', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                        <Grid container>
                            { this.state.bankImage &&
                            <Grid item sm={12} xs={12} style={{textAlign:'center'}}> 
                                <img src={`${this.state.bankImage}`} alt={require(`./../../icons/asira.png`)} width='30%' height='auto'/>
                            </Grid>
                            }
                            <Grid item sm={12} xs={12} style={{textAlign:'center', letterSpacing:'0.72px', color:'#2076B8', fontSize:'2.25em'}}>
                                {this.state.bankName}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )
        }
        if(!getTokenClient()){
            return (
                <Redirect to='/login' />
            )    
        }
       
    }
}

export default Main;