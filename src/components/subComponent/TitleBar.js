import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

class TitleBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      page: 1,
      rowsPerPage: 10,
    };
  }

  render() {
    return (
      <Grid container>
        <Grid item sm={6} xs={6} style={{fontSize:'60%'}} >
          <h2> {this.props.title} </h2> 
        </Grid>

        <Grid item sm={6} xs={6} style={{textAlign:'right'}} >
            <img src={require('./../../icons/asira.png')} alt='Logo Asira' style={{width:'auto',maxHeight:50}}/>
        </Grid>

      </Grid>
    );
  }
}

TitleBar.propTypes = {
  title: PropTypes.string,
};

export default (TitleBar);
