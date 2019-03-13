import React from 'react';
import { RouteComponentProps } from 'react-router';
import {ClipLoader} from 'react-spinners';
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
  user: User,
  dataLoaded: boolean
}

class UserPage extends React.Component<UserPageProps> {

  state: UserPageState

  constructor(props: UserPageProps){
    super(props);
    this.state = {
      userId: parseInt(props.match.params.id, 10),
      user: {userId: 0, userName: "", projects: []} as User,
      dataLoaded: false
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
        user: userData,
        dataLoaded: true
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
      projectsPage: 'projects-page',
      projectList: 'project-list',
      spinnerDiv: 'spinner-div',
      titleHeader: "titleHeader",
      titleDesc: "titleDesc",
      fas: 'fas',
      faedit: 'fa-edit'
    } );

    return (
      this.state.dataLoaded ?
      <div className={classes.projectsPage}>
        <h1 id={classes.titleHeader}>User: {this.state.user.userName}</h1>
        <p id={classes.titleDesc}>The list of projects that you've created is available below.</p>
        <Paper style={{ maxWidth: 800, marginTop: 30 }}>
        <List className={classes.projectList}>
          <Grid container spacing={8} alignItems="flex-end" className={classes.headernav}>
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
            <ListItem className={classes.projDetails}>
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
        </Paper>
      </div> :
      <div id ="center" className={classes.spinnerDiv}>
        <ClipLoader>
        </ClipLoader>
      </div>
    );
  }

}

export default UserPage;