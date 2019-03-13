import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';

const styles = (theme: any) => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: theme.spacing.unit
  }
});

interface LoginState {
  userLoggedIn: boolean,
  adminLoggedIn: boolean,
  userName: string,
  userId: number
}

class LoginPage extends React.Component<any, LoginState> {
  state: LoginState;

  constructor(props: any) {
    super(props);
    this.state = {
      userLoggedIn: false,
      adminLoggedIn: false,
      userName: "",
      userId: 0,
    }
  }


  handleUserLogin = async () => {
    var enteredValue = (document.getElementById('username') as HTMLInputElement)

    var enteredName = enteredValue.value
    // TODO: get the user ID from the backend
    var foundId = enteredValue.value.length

    this.setState({ 
      userLoggedIn: true,
      userName: enteredName,
      userId: foundId
    });
  }

  handleAdminLogin = async () => {
    this.setState({ adminLoggedIn: true });
  }

  render() {
    var classes = {
      login: "login",
      loginContainer: "loginContainer",
      homePage: "homePage",
      margin: "margin",
      titleHeader: "titleHeader",
      titleDesc: "titleDesc",
      inputContainerGrid: "inputContainerGrid"
    }

    console.log(this.state);

    if (this.state.adminLoggedIn) {
      return (<Redirect push to='/adminpage' />);
    } else if (this.state.userLoggedIn) {
      return (<Redirect push to={'/user/'+this.state.userId} />);
    } else {
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
                <Grid item md={true} sm={true} xs={true} className={classes.inputContainerGrid}>
                  <TextField id="username" label="User Name" type="email" fullWidth autoFocus required />
                </Grid>
              </Grid>
              <Grid container justify="center" style={{ marginTop: '20px' }}>
                <Button onClick={this.handleUserLogin} variant="contained" style={{ textTransform: "none" }} id="userButton">Login as User</Button>
              </Grid>
            </div>
          </Paper>
          <Paper className={classes.login}>
            <div className={classes.margin}>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <Fingerprint />
                </Grid>
                <Grid item md={true} sm={true} xs={true} className={classes.inputContainerGrid}>
                  <TextField id="adminid" label="Admin ID" type="email" fullWidth autoFocus required />
                </Grid>
              </Grid>
              <Grid container justify="center" style={{ marginTop: '20px' }}>
                <Button onClick={this.handleAdminLogin} variant="contained" style={{ textTransform: "none" }} id="adminButton">Login as Admin</Button>
              </Grid>
            </div>
          </Paper>
        </div>
      );
    }
  }
}


export default withStyles(styles)(LoginPage);