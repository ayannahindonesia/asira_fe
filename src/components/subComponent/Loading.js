import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import TitleBar from './TitleBar';
import { Grid } from '@material-ui/core';
import { flexbox } from '@material-ui/system';

class LoadingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
      if(nextProps.title !== this.props.title) {
          this.setState({title:nextProps.title})
      }
  }

  

  render() {
    if(this.state.title) {
        return (
        
            <Grid container >
              
              <Grid item sm={12} xs={12}>
                <TitleBar
                  title={this.state.title}
                />
              </Grid>
      
              <Grid 
                item 
                sm={12} xs={12}
                style={{padding:20, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                                     
              >
                
                <Grid container style={{display:flexbox, justifyContent:'center', alignItems:'center'}}>
      
                  <Loader 
                      type="Circles"
                      color="#00BFFF"
                      height="40"	
                      width="40"
                  /> 
                  
                </Grid>
                
      
              </Grid>
              
            </Grid>
        );
    } else {
        return (
        
            <Grid container style={{display:flexbox, justifyContent:'center', alignItems:'center'}}>
                <Loader 
                    type="Circles"
                    color="#00BFFF"
                    height="40"	
                    width="40"
                />               
            </Grid>
        );
    }
    
  }
}

LoadingComponent.propTypes = {
  title:PropTypes.string,
};

export default (LoadingComponent);


