import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'


const styles = (theme: any) => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: theme.spacing.unit
  }
});

class LoginPage extends React.Component {
  render() {
    var classes = {
      login: "login",
      loginContainer: "loginContainer",
      homePage: "homePage",
      margin: "margin",
      titleHeader: "titleHeader",
      titleDesc: "titleDesc"
    }

    return (

        <div className={classes.loginContainer}>
          <h1 id={classes.titleHeader}>Pomodoro Time Tracker</h1>
          <p id={classes.titleDesc}>Welcome to the Pomodoro Time Tracker application! Login as a user or administrator below.</p>
          <Paper className={classes.login}>
            <div className={classes.margin}>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <Face />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <TextField id="username" label="User ID" type="email" fullWidth autoFocus required />
                </Grid>
              </Grid>
              <Grid container justify="center" style={{ marginTop: '20px' }}>
                <Button variant="outlined" color="primary" style={{ textTransform: "none" }} id="userButton">Login as User</Button>
              </Grid>
            </div>
          </Paper>
          <Paper className={classes.login}>
            <div className={classes.margin}>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <Fingerprint />
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <TextField id="adminid" label="Admin ID" type="email" fullWidth autoFocus required />
                </Grid>
              </Grid>
              <Grid container justify="center" style={{ marginTop: '20px' }}>
                <Button variant="outlined" color="primary" style={{ textTransform: "none" }} id="adminButton">Login as Admin</Button>
              </Grid>
            </div>
          </Paper>
        </div>

    );
  }
}


export default withStyles(styles)(LoginPage);