import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker, 
  KeyboardDatePicker,KeyboardTimePicker
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
// type ada 3 - dateOnly , timeOnly dan dateTimeJoin
  if(props.type==='dateTimeJoin'){
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <KeyboardDateTimePicker
            margin="normal"
            id={props.label}
            label={props.label ? props.label:""}
            format={props.format ? props.format :"MM/dd/yyyy HH:mm"}
            value={props.value}
            onChange={props.onChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={props.style?props.style:{}}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }else if(props.type==='dateOnly'){
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          < KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label={props.label ? props.label:""}
            format={props.format ? props.format :"MM/dd/yyyy"}
            value={props.value}
            onChange={props.onChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={props.style?props.style:{}}
          />

        </Grid>
      </MuiPickersUtilsProvider>
    );
  }else if(props.type==='timeOnly'){
    return(
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label={props.label ? props.label:""}
          value={props.value}
          onChange={props.onChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
          style={props.style?props.style:{}}

        />
      </Grid>
    </MuiPickersUtilsProvider>
    )
  }
 
}