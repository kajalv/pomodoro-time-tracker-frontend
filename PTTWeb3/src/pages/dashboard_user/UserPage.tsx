import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ClipLoader } from 'react-spinners';
import User from '../../types/UserInterface';
import Project from '../../types/ProjectInterface';
import { List, ListItem, Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { FetchProjectsByUserId, FetchUserById, DeleteProjectById, CreateNewProject } from '../../RESTful-APIs';

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
  projects: Project[],
  dataLoaded: boolean
}

class UserPage extends React.Component<UserPageProps> {

  state: UserPageState

  constructor(props: UserPageProps) {
    super(props);
    this.state = {
      userId: parseInt(props.match.params.id, 10),
      user: { id: 0, firstName: "", lastName: "", email: "" } as User,
      projects: [] as Project[],
      dataLoaded: false
    }
  }

  // this function will be called right before render function. 
  // make RESTful api calls here to populate data.
  componentWillMount() {
    FetchUserById(this.state.userId)
      .then((user: User) => {
        console.log("fetch user by id");
        console.log(user);
        this.setState({ user });
      });
    FetchProjectsByUserId(this.state.userId)
      .then((projects: Project[]) => {
        console.log("fetch projects by userId");
        this.setState({
          projects: projects,
          dataLoaded: true,
        })
      });
  }

  handleProjectEdit() {
    console.log("edit project");
  };

  handleProjectDelete(projectId: number) {
    DeleteProjectById(this.state.userId, projectId)
      .then((project: Project) => {
        // if(project.id == projectId){
          this.setState({projects: this.state.projects.filter(project => project.id != projectId)});
        // }
      })
  };

  handleCreateProject() {
    CreateNewProject(this.state.userId, "newProject")
      .then((project: Project) => {
        this.setState({projects: this.state.projects.concat(project)});
      })
  }

  render() {

    console.log(this.state);

    var classes = ({
      headernav: 'header-nav',
      projDetails: 'project-details',
      editButton: 'button-edit',
      deleteButton: 'button-delete',
      createButton: 'button-create',
      projectsPage: 'projects-page',
      projectList: 'project-list',
      spinnerDiv: 'spinner-div',
      titleHeader: "titleHeader",
      titleDesc: "titleDesc",
      projitem: 'project-item',
      fas: 'fas',
      faedit: 'fa-edit'
    });

    return (
      this.state.dataLoaded ?
        <div className={classes.projectsPage}>
          <h1 id={classes.titleHeader}>User: {this.state.user.firstName + " " + this.state.user.lastName}</h1>
          <p id={classes.titleDesc}>The list of projects that you've created is available below.</p>
          <Button className={classes.createButton} variant="contained" style={{ textTransform: "none" }} onClick={this.handleCreateProject.bind(this)}>
            Create a New Project
        </Button>
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

              {this.state.projects.map((currentProject, i) =>
                <ListItem key={currentProject.id} className={classes.projDetails}>
                  <Grid container spacing={8} alignItems="flex-end" className={classes.projitem} style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Grid item md={true} sm={true} xs={true}>
                      {currentProject.id}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                      {currentProject.projectName}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                      {currentProject.sessionCount}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                      <Button id={"delete" + currentProject.id} className={classes.deleteButton} onClick={() => this.handleProjectDelete(currentProject.id)} variant="contained" style={{ textTransform: "none" }}>
                        Delete
                  </Button>
                    </Grid>
                  </Grid>
                </ListItem>)}
            </List>
          </Paper>
        </div> :
        <div id="center" className={classes.spinnerDiv}>
          <ClipLoader>
          </ClipLoader>
        </div>
    );
  }

}

export default UserPage;