import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
              <img alt={title} className={classes.media} src={`data:image/PNG;base64,${dataImage}`}/>
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
                        { type && type !== 'image' && 
                            <Typography gutterBottom>
                                {message}
                            </Typography>
                        }
                    </DialogContent>
                    {
                        type && type !== 'image' && 
                        <DialogActions>
                            {
                              type === 'textfield' && 
                              <Button color="primary" onClick={(e) => onClose(e,true)} style={{outline:'none'}}>
                                Yes
                              </Button>
                            }
                            <Button color="primary" onClick={onClose} style={{outline:'none'}}>
                                No
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
    message: PropTypes.string,
    onClose: PropTypes.func,
};
  
export default withStyles(styles)(DialogComponent);