import React from 'react';
import { RouteComponentProps } from 'react-router';
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { User, Project } from '../../models';
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
  dataLoaded: boolean,
  createModalIsOpen: boolean,
  deleteConfModalIsOpen: boolean,
  projectToDelete: number
}

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

class UserPage extends React.Component<UserPageProps> {

  state: UserPageState

  constructor(props: UserPageProps) {
    super(props);
    this.state = {
      userId: parseInt(props.match.params.id, 10),
      user: { id: 0, firstName: "", lastName: "", email: "" } as User,
      projects: [] as Project[],
      dataLoaded: false,
      createModalIsOpen: false,
      deleteConfModalIsOpen: false,
      projectToDelete: -1
    }

    this.handleCreateProject = this.handleCreateProject.bind(this);
    this.afterOpenCreateModal = this.afterOpenCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.closeModalAndCreateProj = this.closeModalAndCreateProj.bind(this);

    this.handleProjectDelete = this.handleProjectDelete.bind(this);
    this.afterOpenDeleteModal = this.afterOpenDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.closeModalAndDeleteProj = this.closeModalAndDeleteProj.bind(this);
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
    this.setState({
      deleteConfModalIsOpen: true,
      projectToDelete: projectId
    });
  };

  afterOpenDeleteModal() {
  }

  closeModalAndDeleteProj() {
    var deleteId = this.state.projectToDelete;

    DeleteProjectById(this.state.userId, deleteId)
      .then((project: Project) => {
        this.setState({ projects: this.state.projects.filter(project => project.id != deleteId) });
      })

    this.setState({
      deleteConfModalIsOpen: false,
      projectToDelete: -1
    })
  }

  closeDeleteModal() {
    this.setState({
      deleteConfModalIsOpen: false
    });
  }

  handleCreateProject() {
    this.setState({
      createModalIsOpen: true
    });
  }

  afterOpenCreateModal() {
    // references are now sync'd and can be accessed.
  }

  closeModalAndCreateProj() {
    var projectname = ((document.getElementById('newprojname') as HTMLInputElement).value)

    if (projectname) {
      CreateNewProject(this.state.userId, projectname as string)
        .then((project: Project) => {
          this.setState({ projects: this.state.projects.concat(project) });
        })
    } else {
      // nothing entered, just close
    }

    this.setState({
      createModalIsOpen: false
    });
  }

  closeCreateModal() {
    this.setState({
      createModalIsOpen: false
    });
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
      modalTitle: 'modal-title',
      modalDesc: 'modal-desc',
      modalInput: 'modal-input',
      modalAction: 'modal-action',
      modalActionContainer: 'modal-action-container'
    });

    return (
      this.state.dataLoaded ?
        <div className={classes.projectsPage}>
          <h1 id={classes.titleHeader}>User: {this.state.user.firstName + " " + this.state.user.lastName}</h1>
          <p id={classes.titleDesc}>The list of projects that you've created is available below.</p>
          <Button className={classes.createButton} variant="contained" style={{ textTransform: "none" }} onClick={this.handleCreateProject.bind(this)}>
            Create a New Project
          </Button>
          <Modal
            isOpen={this.state.createModalIsOpen}
            onAfterOpen={this.afterOpenCreateModal}
            onRequestClose={this.closeCreateModal}
            style={modalStyle}
            contentLabel="Create New Project"
          >
            <h2 className={classes.modalTitle}>Create a New Project</h2>
            <div className={classes.modalDesc}>Enter the name of the project below:</div>
            <TextField className={classes.modalInput} id="newprojname" label="Project Name" type="email" fullWidth autoFocus required />
            <div className={classes.modalActionContainer}>
              <Button className={classes.modalAction} onClick={this.closeModalAndCreateProj.bind(this)} variant="text" style={{ textTransform: "none" }} id="okbuttoncreate">OK</Button>
              <Button className={classes.modalAction} onClick={this.closeCreateModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelbuttoncreate">Cancel</Button>
            </div>
          </Modal>
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

              <Modal
                isOpen={this.state.deleteConfModalIsOpen}
                onAfterOpen={this.afterOpenDeleteModal}
                onRequestClose={this.closeDeleteModal}
                style={modalStyle}
                contentLabel="Delete Project"
              >
                <h2 className={classes.modalTitle}>Delete Project</h2>
                <div className={classes.modalDesc}>Are you sure you want to delete this project?</div>
                <div className={classes.modalActionContainer}>
                  <Button className={classes.modalAction} onClick={this.closeModalAndDeleteProj.bind(this)} variant="text" style={{ textTransform: "none" }} id="okbuttondelete">OK</Button>
                  <Button className={classes.modalAction} onClick={this.closeDeleteModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelbuttondelete">Cancel</Button>
                </div>
              </Modal>
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