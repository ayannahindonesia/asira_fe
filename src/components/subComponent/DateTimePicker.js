import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker, 
  KeyboardDatePicker,KeyboardTimePicker
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
// type ada 3 - tanggalOnly , timeOnly dan dateTimeJoin

  if(props.type==='dateTimeJoin'){
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            margin="normal"
            id={props.label}
            label={props.label ? props.label:""}
            format={props.format ? props.format :"MM/dd/yyyy HH:mm"}
            value={props.value}
            onChange={props.onChange}
            fullWidth
            inputVariant='outlined'
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={props.style?props.style:{}}
          />

      </MuiPickersUtilsProvider>
    );
  }else if(props.type==='dateOnly'){
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          < KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label={props.label ? props.label:""}
            format={props.format ? props.format :"MM/dd/yyyy"}
            value={props.value}
            onChange={props.onChange}
            maxDate={'2200-01-01'}
            fullWidth
            inputVariant='outlined'
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            InputProps={props.InputProps}
            // style={props.style?props.style:{}}
          />
      </MuiPickersUtilsProvider>
    );
  }else if(props.type==='timeOnly'){
    return(
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      
        <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          label={props.label ? props.label:""}
          value={props.value}
          onChange={props.onChange}
          inputVariant='outlined'
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
          style={props.style?props.style:{}}

        />
    
    </MuiPickersUtilsProvider>
    )
  }
 
}