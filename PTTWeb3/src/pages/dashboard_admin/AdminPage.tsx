import React from 'react';
import {Link} from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { User, Project } from '../../models';
import { List, ListItem, Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { FetchAllUsers, CreateNewUser, DeleteUserById, UpdateUserById, FetchUserById } from '../../RESTful-APIs';

interface AdminPageProps extends RouteComponentProps {

}

// store admin data.
interface AdminPageState {
  dataLoaded: boolean,
  userList: User[],
  createModalIsOpen: boolean,
  editModalIsOpen: boolean,
  deleteConfModalIsOpen: boolean,
  userToDelete: number,
  userToEdit: number
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

class AdminPage extends React.Component {

  state: AdminPageState

  constructor(props: AdminPageProps) {
    super(props);
    this.state = {
      dataLoaded: false,
      userList: [] as User[],
      createModalIsOpen: false,
      editModalIsOpen: false,
      deleteConfModalIsOpen: false,
      userToDelete: -1,
      userToEdit: -1
    }

    this.handleCreateUser = this.handleCreateUser.bind(this);
    this.afterOpenCreateModal = this.afterOpenCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.closeModalAndCreateUser = this.closeModalAndCreateUser.bind(this);
    this.closeModalAndDeleteUser = this.closeModalAndDeleteUser.bind(this);
  }

  // this function will be called right before render function.
  // make RESTful api calls here to populate data.
  componentWillMount() {
    FetchAllUsers()
      .then((users: User[]) => {
        this.setState({
          userList: users as User[]
        });
      });
  }

  handleUserEdit(userId: number) {
    this.setState({
      editModalIsOpen: true,
      userToEdit: userId
    })
  };

  afterOpenEditModal() {
  }

  closeModalAndEditUser() {
    var editId = this.state.userToEdit;

    var userfirstname = ((document.getElementById('editfirstname') as HTMLInputElement).value)
    var userlastname = ((document.getElementById('editlastname') as HTMLInputElement).value)

    if (userfirstname && userlastname) {
      FetchUserById(editId)
      .then((user: User) => {
        var email = user.email;

        UpdateUserById(editId as number, userfirstname as string, userlastname as string, email as string)
          .then((user: User) => {
            var newUserList = [] as User[];
            for (var i = 0; i < this.state.userList.length; i++) {
              if (this.state.userList[i].id == editId) {
                newUserList.push(user);
              } else {
                newUserList.push(this.state.userList[i]);
              }
              console.log(newUserList)
            }
            this.setState({
              userList: newUserList
            });
          });
      });
    } else {
      // nothing entered, just close
    }

    this.setState({
      editModalIsOpen: false,
      userToEdit: -1
    });
  }

  closeEditModal() {
    this.setState({
      editModalIsOpen: false
    });
  }

  handleUserDelete(userId: number) {
    this.setState({
      deleteConfModalIsOpen: true,
      userToDelete: userId
    });
  };

  afterOpenDeleteModal() {
  }

  closeModalAndDeleteUser() {
    var deleteId = this.state.userToDelete;

    DeleteUserById(deleteId)
      .then((user: User) => {
        this.setState({ userList: this.state.userList.filter(user => user.id != deleteId) });
      });

    this.setState({
      deleteConfModalIsOpen: false,
      userToDelete: -1
    })
  }

  closeDeleteModal() {
    this.setState({
      deleteConfModalIsOpen: false
    });
  }

  handleCreateUser() {
    this.setState({
      createModalIsOpen: true
    });
  }

  afterOpenCreateModal() {
    // references are now sync'd and can be accessed.
  }

  closeModalAndCreateUser() {
    var userfirstname = ((document.getElementById('newuserfirstname') as HTMLInputElement).value)
    var userlastname = ((document.getElementById('newuserlastname') as HTMLInputElement).value)
    var useremail = ((document.getElementById('newuseremail') as HTMLInputElement).value)

    if (userfirstname && userlastname && useremail) {
      CreateNewUser(userfirstname as string, userlastname as string, useremail as string)
        .then((user: User) => {
          this.setState({ userList: this.state.userList.concat(user) });
        });
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
      modalActionContainer: 'modal-action-container',
    });

    return (
      <div className={classes.projectsPage}>
          <h1 id={classes.titleHeader}>Administrator Dashboard</h1>
          <p id={classes.titleDesc}>The list of users in the system is available below.</p>
          <Button className={classes.createButton}
                  variant="contained"
                  style={{ textTransform: "none" }}
                  onClick={this.handleCreateUser.bind(this)}
                  id="CreateNewUser"
          >
            Create a New User
          </Button>
          <Modal
            isOpen={this.state.createModalIsOpen}
            onAfterOpen={this.afterOpenCreateModal}
            onRequestClose={this.closeCreateModal}
            style={modalStyle}
            contentLabel="Create New User"
          >
            <h2 className={classes.modalTitle}>Create a New User</h2>
            <div className={classes.modalDesc}>Enter the details of the user below:</div>
            <TextField className={classes.modalInput} id="newuserfirstname" label="First Name" type="email" fullWidth autoFocus required />
            <TextField className={classes.modalInput} id="newuserlastname" label="Last Name" type="email" fullWidth autoFocus required />
            <TextField className={classes.modalInput} id="newuseremail" label="Email" type="email" fullWidth autoFocus required />
            <div className={classes.modalActionContainer}>
              <Button className={classes.modalAction} onClick={this.closeModalAndCreateUser.bind(this)} variant="text" style={{ textTransform: "none" }} id="okbuttoncreate">OK</Button>
              <Button className={classes.modalAction} onClick={this.closeCreateModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelbuttoncreate">Cancel</Button>
            </div>
          </Modal>
          <Modal
            isOpen={this.state.editModalIsOpen}
            onAfterOpen={this.afterOpenEditModal}
            onRequestClose={this.closeEditModal}
            style={modalStyle}
            contentLabel="Edit User"
          >
            <h2 className={classes.modalTitle}>Edit User</h2>
            <div className={classes.modalDesc}>Enter the new details of the user below:</div>
            <TextField className={classes.modalInput} id="editfirstname" label="First Name" type="email" fullWidth autoFocus required />
            <TextField className={classes.modalInput} id="editlastname" label="Last Name" type="email" fullWidth autoFocus required />
            <div className={classes.modalActionContainer}>
              <Button className={classes.modalAction} onClick={this.closeModalAndEditUser.bind(this)} variant="text" style={{ textTransform: "none" }} id="okbuttonedit">OK</Button>
              <Button className={classes.modalAction} onClick={this.closeEditModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelbuttonedit">Cancel</Button>
            </div>
          </Modal>
          <Paper style={{ maxWidth: 800, marginTop: 30 }}>
            <List className={classes.projectList}>
              <Grid container spacing={8} alignItems="flex-end" className={classes.headernav}>
                <Grid item md={true} sm={true} xs={true}>
                  <div>User ID</div>
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <div>User Name</div>
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <div>Email</div>
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <div>Actions</div>
                </Grid>
              </Grid>

              {this.state.userList.map((currentUser, i) =>
                <ListItem key={currentUser.id} className={classes.projDetails}>
                  <Grid container spacing={8} alignItems="flex-end" className={classes.projitem} style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Grid item md={true} sm={true} xs={true} id="user_id">
                      {currentUser.id}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true} id="user_name">
                      {currentUser.firstName} {currentUser.lastName}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true} id="user_email">
                      {currentUser.email}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true}>
                      <Button id={"edit" + currentUser.id} className={classes.editButton} onClick={() => this.handleUserEdit(currentUser.id)} variant="contained" style={{ textTransform: "none" }}>
                        Edit
                      </Button>
                      <Button id={"delete" + currentUser.id} className={classes.deleteButton} onClick={() => this.handleUserDelete(currentUser.id)} variant="contained" style={{ textTransform: "none" }}>
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
                contentLabel="Delete User"
              >
                <h2 className={classes.modalTitle}>Delete User</h2>
                <div className={classes.modalDesc}>Are you sure you want to delete this user?</div>
                <div className={classes.modalActionContainer}>
                  <Button className={classes.modalAction} onClick={this.closeModalAndDeleteUser.bind(this)} variant="text" style={{ textTransform: "none" }} id="okbuttondelete">OK</Button>
                  <Button className={classes.modalAction} onClick={this.closeDeleteModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelbuttondelete">Cancel</Button>
                </div>
              </Modal>
            </List>
          </Paper>
        </div>
    );
  }

}

export default AdminPage;