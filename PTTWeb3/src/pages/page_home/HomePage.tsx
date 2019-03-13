import React from 'react';
import {Link} from 'react-router-dom';
import {List, ListItem, Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop} from '@material-ui/core';


class HomePage extends React.Component {

  render() {
    var classes = {
      homePage: "homePage",
      loginLink: "loginLink"
    }

    return (
      <div className={classes.homePage}>
        <img src={require("../../assets/large_pomodoro.png")}></img>
        <Link to='/login' style={{ textDecoration: 'none' }}>
          <div className={classes.loginLink}>
            <Button variant="contained" style={{ textTransform: "none" }}>
              Get Started!
            </Button>
          </div>
        </Link>
      </div>
    );
  }

}

export default HomePage;