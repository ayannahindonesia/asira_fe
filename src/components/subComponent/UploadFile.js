import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width:'100%',
    height:'100%',
    '& > *': {
      width:'100%',
      height:'100%',
    },
  },
  input: {
    width:'500px',
    display: 'none',
  },
}));


export default function UploadButtons(props) {
  const classes = useStyles();
  
  return (
    <Grid container className={classes.root}>
      <input
        accept="image/*"
        className={classes.input}
        id="outlined-button-file"
        type="file"
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <label htmlFor="outlined-button-file" style={{paddingTop:'10px'}}>
        <Button variant="outlined" component="span" fullWidth disabled={props.disabled}>
          {
            props.file && 
            <img src={props.file} alt={'-'} style={{maxWidth:'120px', maxHeight:'inherit'}} />
          }

          {
            !props.file &&
            'Upload your File'
          }
          
        </Button>
      </label>
    </Grid>
  );
}