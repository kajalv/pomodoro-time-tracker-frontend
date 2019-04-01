import React from 'react';
import { Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';
import { FetchAllUsers, FetchUserById } from '../../RESTful-APIs';
import { User } from '../../models/UserInterface';

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
  userEnteredInvalid: boolean,
  adminEnteredInvalid: boolean,
  userEmail: string,
  userId: number
}

class LoginPage extends React.Component<any, LoginState> {
  state: LoginState;

  constructor(props: any) {
    super(props);
    this.state = {
      userLoggedIn: false,
      adminLoggedIn: false,
      userEnteredInvalid: false,
      adminEnteredInvalid: false,
      userEmail: "",
      userId: 0,
    }
  }


  handleUserLogin() {
    var enteredValue = (document.getElementById('useremail') as HTMLInputElement)

    var enteredEmail = enteredValue.value
    var userEmailFound = false
    var foundUser = {} as User;
    // TODO: get the user corresponding to this email ID from the backend
    FetchAllUsers()
      .then((users: User[]) => {

        users.forEach(element => {
          if (element.email == enteredEmail) {
            userEmailFound = true
            foundUser = element
          }
        });

        if (userEmailFound) {
          FetchUserById(foundUser.id)
            .then((user: User) => {
              this.setState({
                userLoggedIn: true,
                userEmail: enteredEmail,
                userEnteredInvalid: false, // in case it was set to true earlier, just unset
                userId: user.id
              });
            });
        } else {
          this.setState({
            userEnteredInvalid: true
          });
        }
      });

  }

  handleAdminLogin() {
    var enteredValue = (document.getElementById('adminid') as HTMLInputElement)
    var enteredAdminId = enteredValue.value

    if (enteredAdminId == "admin") {

      this.setState({
        adminLoggedIn: true,
        adminEnteredInvalid: false, // in case it was set to true earlier, just unset
      });

    } else {
      this.setState({
        adminEnteredInvalid: true
      });
    }
  }

  render() {
    var classes = {
      login: "login",
      loginContainer: "loginContainer",
      homePage: "homePage",
      margin: "margin",
      titleHeader: "titleHeader",
      titleDesc: "titleDesc",
      inputContainerGrid: "inputContainerGrid",
      invalidLabel: "invalidLabel"
    }

    console.log(this.state);

    if (this.state.adminLoggedIn) {
      return (<Redirect push to='/adminpage' />);
    } else if (this.state.userLoggedIn) {
      return (<Redirect push to={'/user/' + this.state.userId} />);
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
                  <TextField id="useremail" label="User Email" type="email" fullWidth autoFocus required />
                </Grid>
              </Grid>
              {this.state.userEnteredInvalid && <Grid item md={true} sm={true} xs={true} className={classes.invalidLabel} id="invaliduser">
                Invalid email entered!
              </Grid>}
              <Grid container justify="center" style={{ marginTop: '20px' }}>
                <Button onClick={this.handleUserLogin.bind(this)} variant="contained" style={{ textTransform: "none" }} id="userButton">Login as User</Button>
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
              {this.state.adminEnteredInvalid && <Grid item md={true} sm={true} xs={true} className={classes.invalidLabel} id="invalidadmin">
                Invalid credentials!
              </Grid>}
              <Grid container justify="center" style={{ marginTop: '20px' }}>
                <Button onClick={this.handleAdminLogin.bind(this)} variant="contained" style={{ textTransform: "none" }} id="adminButton">Login as Admin</Button>
              </Grid>
            </div>
          </Paper>
        </div>
      );
    }
  }
}


export default withStyles(styles)(LoginPage);