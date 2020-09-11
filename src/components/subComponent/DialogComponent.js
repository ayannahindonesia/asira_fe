import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DropDown from '../subComponent/DropDown';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import BrokenLink from './../../support/img/default.png'
import DatePicker from './../subComponent/DateTimePicker'
import { Grid, TextField, FormControlLabel, Checkbox } from '@material-ui/core';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  card: {
    maxWidth: 500,
  },
  media: {
    height: 300,
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose} style={{outline:'none'}}>
          <CloseIcon />
        </IconButton>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


class DialogComponent extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        errorText: '',
      };
    }

    imageArea = (classes, message, title, base64Boolean) => {

      const dataImage = message;

      return (
        <Card className={classes.card}>
          <CardActionArea>
            {
              base64Boolean && 
              <img alt={title} className={classes.media} 
              onError={(e)=>{e.target.attributes.getNamedItem("src").value = BrokenLink}}
              src={`data:image/PNG;base64,${dataImage}`}/>
            }

            {
              !base64Boolean && 
              <CardMedia
                className={classes.media}
                image={dataImage && dataImage.includes('http') ? dataImage : require('./../../support/img/default.png')}
                title={title}
              />
            }
            
            
          </CardActionArea>
        </Card>
      );
    }

    render() {
        const {
            classes,
            type,
            title,
            message,
            onClose,
        } = this.props;
        
        return ( 
            <div>
                <Dialog aria-labelledby="customized-dialog-title" open={this.props.openDialog ? true : false} fullWidth>
                    <DialogTitle id="customized-dialog-title" onClose={onClose}>
                        {title}
                    </DialogTitle>
                    <DialogContent dividers>
                        { type && type === 'image' && this.imageArea(classes, message, title, this.props.base64Boolean)}
                        { (!type || (type && type === 'textfield')) && 
                            <Typography gutterBottom>
                              {message}
                            </Typography>
                        }
                        {
                          type && type === 'form' && message && message.map((formMessage, index) => {
                            
                            if(formMessage.type && formMessage.type === 'checkbox') {
                              return (
                                <Grid container key={`${formMessage.id}-${index}`} style={{paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                                  <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                      <b>{formMessage.title}</b>
                                  </Grid>
                                  <Grid item xs={6} sm={6} style={{paddingTop:'10px'}}>
                                    <FormControlLabel
                                      control={
                                          <Checkbox
                                            checked={formMessage.value}
                                            color={formMessage.value ? "primary":"default"}
                                            value="default"
                                            inputProps={{ 'aria-label': 'checkbox with default color' }}
                                            onClick={(e) => formMessage.function(e, formMessage.id)}
                                          />
                                      }
                                      label={formMessage.label}
                                      disabled={formMessage.disabled}
                                    />
                                  </Grid>
                                </Grid>
                                
                              )
                            } else if(!formMessage.type || (formMessage.type && formMessage.type === 'textfield')) {
                              
                              return (
                                <Grid container key={`${formMessage.id}-${index}`} style={{paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                                  <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                      <b>{formMessage.title}</b>
                                  </Grid>
                                  <Grid item xs={6} sm={6} >
                                      <TextField
                                          id={formMessage.id}
                                          value={formMessage.value}
                                          onChange={(e) => formMessage.function(e, formMessage.id, formMessage.numeric)} 
                                          margin="dense"
                                          variant="outlined"
                                          disabled={formMessage.disabled}
                                          multiline
                                          fullWidth
                                      /> 
                                  </Grid>
                                </Grid>
                              )
                            } else if (formMessage.type && formMessage.type === 'date'){
                              return (
                                <Grid container key={`${formMessage.id}-${index}`} style={{paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'25px'}}>
                                        <b>{formMessage.title}</b>
                                        
                                    </Grid>
                                    <Grid item xs={6} sm={6} style={{alignItems:"left"}}>
                                        <DatePicker
                                            id={formMessage.id}
                                            type='dateOnly'
                                            onChange={(e) => formMessage.function(e, formMessage.id, false, formMessage.type === 'date')}
                                            value={formMessage.value}
                                            disabled={formMessage.disabled}
                                            style={{top:"-20px",border:"1px solid grey",borderRadius:"3px", padding:'5px 0px 5px 10px'}}
                                        />
                                        
                                    </Grid>
                                </Grid>
                              )
                            } else if (formMessage.type && formMessage.type === 'dropdown'){
                              return(
                                <Grid container key={`${formMessage.id}-${index}`} style={{paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                                  <Grid item xs={4} sm={4} style={{paddingTop:'25px'}}>
                                      <b>{formMessage.title}</b>
                                      
                                  </Grid>
                                  <Grid item xs={6} sm={6} style={{alignItems:"left"}}>
                                    < DropDown
                                      value={formMessage.value}
                                      label="label"
                                      data={formMessage.data}
                                      id="id"
                                      labelName={"label"}
                                      onChange={(e) => formMessage.function(e, formMessage.id)}
                                      fullWidth
                                      disabled={formMessage.disabled}
                                    />
                                      
                                  </Grid>                                    
                                </Grid>
                              )
                            } else {
                              return null
                            }
                          }, this)
                        }
                    </DialogContent>
                    {
                        type && type !== 'image' && 
                        <DialogActions>
                            
                            {
                              !this.props.noNextStep &&
                              <Button color="primary" onClick={(e) => onClose(e,true)} style={{outline:'none'}}>
                                Ya
                              </Button>
                            }
                            
                            
                            <Button color="primary" onClick={onClose} style={{outline:'none'}}>
                              {this.props.noNextStep ? 'Kembali' : 'Tidak'}
                            </Button>
                        </DialogActions>
                    }
                    
                </Dialog>
            </div>
        );
    }
}

DialogComponent.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    onClose: PropTypes.func,
};
  
export default withStyles(styles)(DialogComponent);