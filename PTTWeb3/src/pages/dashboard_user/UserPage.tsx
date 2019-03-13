import React from 'react';
import { RouteComponentProps } from 'react-router';
import {User} from '../../types/UserInterface';
import {Project} from '../../types/ProjectInterface';
import {List, ListItem, Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop} from '@material-ui/core';

// match the id paremeter from the path.
interface MatchParam {
  id: string
}

interface UserPageProps extends RouteComponentProps<MatchParam> {

}

// store user data.
interface UserPageState {
  userId: number,
  user: User
}

class UserPage extends React.Component<UserPageProps> {

  state: UserPageState

  constructor(props: UserPageProps){
    super(props);
    this.state = {
      userId: parseInt(props.match.params.id, 10),
      user: {userId: 0, userName: "", projects: []} as User,
    }
  }

  // this function will be called right before render function. 
  // make RESTful api calls here to populate data.
  componentWillMount(){
    // fetch user data in this function.
    setTimeout(() => {
      let userData: User = {} as User;
      let projects: Project[] = [];
      // TODO: Get all this from backend
      for(var i = 0; i < 10; i++){
        projects.push({
          projectId: i,
          projectName: "projName",
          sessionCount: i
        })
      }
      userData = {
        userId: this.state.userId,
        userName: "usernamefrombackend",
        projects: projects
      }

      this.setState({
        user: userData
      })
    }, 2000);
  }

  handleProjectEdit = async () => {
    console.log("edit project");
  };

  handleProjectDelete = async () => {
    console.log("delete project");
  };

  render() {

    console.log(this.state);

    var classes = ( {
      headernav: 'header-nav',
      projDetails: 'project-details',
      editButton: 'button-edit',
      deleteButton: 'button-delete',
      fas: 'fas',
      faedit: 'fa-edit'
    } );

    return (
      <div>
        <h2> User Page: {this.state.user.userName}</h2>
        <List>
          <Grid container spacing={8} alignItems="flex-end" style={{ maxWidth: 800 }} className={classes.headernav}>
            <Grid item md={true} sm={true} xs={true}>
              <div>Project ID</div>
            </Grid>
            <Grid item md={true} sm={true} xs={true}>
              <div>Project Name</div>
            </Grid>
            <Grid item md={true} sm={true} xs={true}>
              <div>Sessions</div>
            </Grid>
            <Grid item md={true} sm={true} xs={true}>
              <div>Actions</div>
            </Grid>
          </Grid>

          {this.state.user.projects.map((currentProject, i) =>
            <ListItem className={classes.projDetails} style={{ maxWidth: 800 }}>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item md={true} sm={true} xs={true}>
                  {currentProject.projectId}
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  {currentProject.projectName}
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  {currentProject.sessionCount}
                </Grid>
                <Grid container md={true} sm={true} xs={true}>
                  <Grid item md={true} sm={true} xs={true}>
                    <Button className={classes.editButton} onClick={this.handleProjectEdit} variant="outlined" color="primary" style={{ textTransform: "none" }}>
                      Edit
                    </Button>
                  </Grid>
                  <Grid item md={true} sm={true} xs={true}>
                    <Button className={classes.deleteButton} onClick={this.handleProjectDelete} variant="outlined" color="primary" style={{ textTransform: "none" }}>
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </ListItem> )}
        </List>
      </div>
    );
  }

}

export default UserPage;