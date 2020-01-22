import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';

const styles = (theme) => ({

  formControl: {
    // margin: theme.spacing.unit * 3,
  },
  formItem :{
    width:'100%'
  }
});

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      error: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errorText !== this.props.errorText) {
      this.setState({    
        errorText: nextProps.errorText,
      });
    }

    if (nextProps.error !== this.props.error) {
      this.setState({    
        error: nextProps.error,
      });
    }
  }

  render() {
    const {
      classes,
      label,
      value,
    } = this.props;

    return (
      <TextField
        label={label}
        type="date"
        defaultValue={value}
        onChange={this.props.onChange}
        className={classes.textField}
        error={this.state.error}
        helperText={this.state.errorText}
        InputLabelProps={{
          shrink: true,
        }}
      />
    );
  }
}

DropDown.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  classes: PropTypes.object,
  onChange: PropTypes.func,
  onChecked: PropTypes.func,
  disabled: PropTypes.bool,
  vertical: PropTypes.bool,
  error: PropTypes.bool,
  errorText:PropTypes.string,
};

export default withStyles(styles)(DropDown);
