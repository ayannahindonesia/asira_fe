import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import NativeSelect from '@material-ui/core/NativeSelect';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const styles = (theme) => ({
  selectField: {
    minWidth: 120,
    display: 'flex',
    flexWrap: 'wrap', 
    marginTop: '1em',
  },

  formControl: {
    minWidth: 120,
    maxWidth: 300,
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '1em',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      this.setState({
        error: nextProps.error,
      });
    }
  }


  render() {
    const {
      classes,
      fullWidth,
      label,
      data,
      id,
      labelName,
      value,
      onChange,
      disabled,
      multiple,
    } = this.props;
    
    if(multiple) {
      return (
        <FormControl className={classes.formControl} error={!!this.state.error}>
          <Select
            style={{border: '1px solid #ced4da', paddingLeft:'5px'}}
            multiple
            fullWidth
            value={value}
            onChange={onChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={value => (
              <div className={classes.chips}>
                {value.map(dataChip => (
                  <Chip key={dataChip[id]} label={dataChip[labelName]} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {data.map(data => (
              <MenuItem key={data[id]} value={data[id]} >
                {data[labelName]}
              </MenuItem>
            ))}
          </Select>
          {this.state.error && (
            <FormHelperText>{this.state.error}</FormHelperText>
          )}
        </FormControl>
      ); 
    } else {
      
      return (
        <FormControl className={classes.selectField} error={!!this.state.error}>
          <NativeSelect
            value={value}
            onChange={onChange}
            fullWidth={fullWidth}
            style={{border: '1px solid #ced4da', paddingLeft:'5px'}}
            inputProps={{
              name: label,
              id: label,
            }}
            disabled={disabled}
          >
            {data &&
              Object.keys(data).length &&
              data.map((object) => {
                const idObject = object[id];
                const labelNames = labelName.split('-');
                let labelObject = '';
                if (labelNames.length > 1) {
                  for (let i = 0; i < labelNames.length; i++) {
                    labelObject = `${labelObject } - ${ object[labelNames[i]]}`;
                  }
                  labelObject = labelObject.substr(3);
                } else {
                  labelObject = object[labelNames];
                }
  
                return (
                  <option value={idObject} key={idObject}>
                    {labelObject}
                  </option>
                );
              })} 
          </NativeSelect>
          {this.state.error && (
            <FormHelperText>{this.state.error}</FormHelperText>
          )}
        </FormControl>
      );
    }
    
    
  }
}

DropDown.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  labelName: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

export default withStyles(styles)(DropDown);
