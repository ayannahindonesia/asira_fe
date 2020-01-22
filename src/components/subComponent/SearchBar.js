import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const styles = (theme) => ({
  root: {
    fontSize:'12px',
    padding: '4px 10px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height:"70%",
    boxShadow: 'none',
    border:"1px solid rgba(0,0,0,0.25)",
    maxWidth:'300px',
  },
  input: {
    marginLeft: theme.spacing * 1,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
});

class SearchBar extends React.Component  {
 
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

  render(){
    const {
        classes,
        placeholder,
    } = this.props;

    return (
        <Paper className={classes.root} style={{float:this.props.float || 'left'}}>
          <InputBase
            className={classes.input}
            placeholder={placeholder}
            onChange={this.props.onChange}
            value={this.props.value}
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton className={classes.iconButton} aria-label="search" disabled>
            <SearchIcon disabled/>
          </IconButton>
        </Paper>
    );
  }
  
}

SearchBar.propTypes = {
    error: PropTypes.string,
    placeholder: PropTypes.string,
};

export default withStyles(styles)(SearchBar);