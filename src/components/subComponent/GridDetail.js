import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import './../../support/css/gridDetail.css'

const styles = (theme) => ({

  gridDetail: {
    fontSize: 'calc(10px + 0.3vw)',
    marginBottom: '5px',
    wordWrap:'break-word',
    flexWrap:'wrap',
  },

});

class GridDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorText: '',
    };
  }

  // componentDidMount() {
  //   if(this.props.data) {
  //     this.refresh(this.props.data)
  //   }
  // }

  renderDataColumn = (dataColumn, dataLabel) => {
    let tester = '';
    
    tester = dataColumn && dataColumn.map((dataRow, index) => {
      return(
        <Grid item sm={parseInt(12 / dataColumn.length)} xs={12} key={index}>
          <Grid container style={{marginBottom:'10px', flexWrap:'wrap'}}> 
            {this.renderDataRow(dataRow, dataLabel && dataLabel[index], index)}
          </Grid>
        </Grid>
      )
    }, this)
      
    

    return tester
  }

  lengthGridLabel = (lengthLabel) => {
    let pjgLabel = 6;

    if(lengthLabel) {
      pjgLabel = lengthLabel
    }

    return pjgLabel
  }

  lengthGridValue = (lengthLabel) => {
    let pjgValue = 6;

    if(lengthLabel) {
      pjgValue = 12 - lengthLabel
    }

    return pjgValue
  }

  findBold = (data) => {
    let dataNew = data.toString();

    if(dataNew.includes('<b>')) {
      dataNew = dataNew.split('<b>')
      return <b> {dataNew[1]} </b>;
    }
    
    return dataNew;
  }

  renderDataRow = (dataRow, dataPerLabel, indexColumn) => {
    let tester = '';

    tester = dataRow && dataRow.map((dataPerRow, index) => {
      return (
        <Grid item sm={12} xs={12} key={index}>

          <Grid container style={{marginBottom:'5px'}}> 
            <Grid item sm={this.lengthGridLabel(this.props.gridLabel && this.props.gridLabel[indexColumn])} xs={this.lengthGridLabel(this.props.gridLabel && this.props.gridLabel[indexColumn])}>
              <b>{ dataPerLabel && dataPerLabel[index] }</b>
            </Grid>

            <Grid item sm={this.lengthGridValue(this.props.gridLabel && this.props.gridLabel[indexColumn])} xs={this.lengthGridValue(this.props.gridLabel && this.props.gridLabel[indexColumn])}>
              <Grid container>
                <Grid item sm={1} xs={1} style={{maxWidth:'15px'}}>
                  {
                    (!this.props.noEquals) && <b> : </b>
                  }
                </Grid>

                <Grid item sm={11} xs={11} style={{color:dataPerRow&& dataPerRow.color? dataPerRow.color:dataPerRow}} >
                  {
                    dataPerRow && dataPerRow.color ?  dataPerRow.value : (dataPerRow ? this.findBold(dataPerRow) : '-')
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      )
    }, this);
      
    return tester
  }

  render() {
    const {
      classes,
      title,
      label,
      data,
    } = this.props;
    
    return ( 
      <Grid container 
        className={classes.gridDetail} 
        style={
          {
            backgroundColor: this.props.background ? '#D8E6FF' : 'none', 
            padding: this.props.background ? '10px 0px 0px 10px' : '0px 0px 0px 10px',
            fontWeight: this.props.background ? 'bold' : 'normal',
            borderRadius:'5px'
          }
        }
      >

        <Grid item sm={12} xs={12} style={{color:"#2076B8", marginBottom: !this.props.noTitleLine && title ?'10px' :'0px'}}>
              { !this.props.noTitleLine && title &&
                <h4>
                
                  <span style={{backgroundColor:'white'}}> 
                
                    {title && title} 

                  </span>
                

                
                
                </h4>
              }

              {
                !this.props.noTitleLine && !title &&
                <hr style={{borderTop: '1px solid rgba(32,118,184,1)'}}/>
              }

              { this.props.noTitleLine && title &&
                <div style={{fontSize:'1rem'}}>{ title }</div>
              }
            </Grid>
        
        {data && label && this.renderDataColumn(data, label)}

      </Grid>
    );
  }
}

GridDetails.propTypes = {
  title: PropTypes.string,
  label: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default withStyles(styles)(GridDetails);
