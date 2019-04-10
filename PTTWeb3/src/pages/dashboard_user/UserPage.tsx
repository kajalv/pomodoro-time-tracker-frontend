import React from 'react';
import Dropdown from 'react-dropdown';
import { RouteComponentProps } from 'react-router';
import { Radio, RadioGroup } from 'react-radio-group';
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { User, Project, Report } from '../../models';
import { List, ListItem, Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { FetchProjectsByUserId, FetchUserById, DeleteProjectById, CreateNewProject, UpdateUserById, GetReportByProjectId } from '../../RESTful-APIs';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

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
  startSessionModalIsOpen: boolean,
  deleteConfModalIsOpen: boolean,
  updateInfoModalIsOpen: boolean,
  projectToDelete: number,
  selectedAssociationValue: string,
  projectNameToAssociate: string,
  backPressed: boolean,
  sessionStarted: boolean,
  reportRequested: boolean,
  reportModalIsOpen: boolean,
  projectNameForReport: string,
  selectedCompletedPomoOption: string,
  selectedHoursOption: string,
  selectedStartTime: Date,
  selectedEndTime: Date,
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

class UserPage extends React.Component<UserPageProps, UserPageState> {

  state: UserPageState
  _isMounted: boolean

  constructor(props: UserPageProps) {
    super(props);
    this.state = {
      userId: parseInt(props.match.params.id, 10),
      user: { id: 0, firstName: "", lastName: "", email: "" } as User,
      projects: [] as Project[],
      dataLoaded: false,
      createModalIsOpen: false,
      startSessionModalIsOpen: false,
      deleteConfModalIsOpen: false,
      updateInfoModalIsOpen: false,
      projectToDelete: -1,
      selectedAssociationValue: "no",
      projectNameToAssociate: "",
      backPressed: false,
      sessionStarted: false,
      reportRequested: false,
      reportModalIsOpen: false,
      projectNameForReport: "",
      selectedCompletedPomoOption: "",
      selectedHoursOption: "",
      selectedStartTime: new Date(),
      selectedEndTime: new Date(),
    }
    this._isMounted = false;

    this.handleCreateProject = this.handleCreateProject.bind(this);
    this.handleStartSession = this.handleStartSession.bind(this);
    this.afterOpenCreateModal = this.afterOpenCreateModal.bind(this);
    this.closeCreateModal = this.closeCreateModal.bind(this);
    this.closeModalAndCreateProj = this.closeModalAndCreateProj.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.handleGetReport = this.handleGetReport.bind(this);

    this.handleProjectDelete = this.handleProjectDelete.bind(this);
    this.afterOpenDeleteModal = this.afterOpenDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.closeModalAndDeleteProj = this.closeModalAndDeleteProj.bind(this);

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleReportDropdownChange = this.handleReportDropdownChange.bind(this);
    this.handlePomoOptionChange = this.handlePomoOptionChange.bind(this);
    this.handleHoursOptionChange = this.handleHoursOptionChange.bind(this);
    this.handleDateChangeFrom = this.handleDateChangeFrom.bind(this);
    this.handleDateChangeTo = this.handleDateChangeTo.bind(this);
  }

  // this function will be called right before render function. 
  // make RESTful api calls here to populate data.
  componentWillMount() {
    FetchUserById(this.state.userId)
      .then((user: User) => {
        this._isMounted && this.setState({ user });
      })
      .catch(_ => {
        window.alert("User does not exist. Redirecting back to login page.");
        this.props.history.replace("/login");
      });
    FetchProjectsByUserId(this.state.userId)
      .then((projects: Project[]) => {
        this._isMounted && this.setState({
          projects: projects,
          dataLoaded: true,
        })
      })
      .catch();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

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
          this.setState({
            projects: this.state.projects.concat(project),
            createModalIsOpen: false
          });
        })
    } else {
      // nothing entered, just close
      alert("Project name cannot be empty!")
    }
  }

  closeCreateModal() {
    this.setState({
      createModalIsOpen: false
    });
  }

  handleGetReport() {
    this.setState({
      reportModalIsOpen: true
    })
  }

  closeModalAndGetReport() {
    var user = this.state.userId;
    var project = 0 as number;
    for (var i = 0; i < this.state.projects.length; i++) {
      if (this.state.projects[i].projectname == this.state.projectNameForReport) {
        project = this.state.projects[i].id;
      }
    }
    var start_time = (this.state.selectedStartTime).toISOString();
    var end_time = (this.state.selectedEndTime).toISOString();
    var option_pomo = this.state.selectedCompletedPomoOption == "yes" ? true : false;
    var option_hours = this.state.selectedHoursOption == "yes" ? true : false;

    if (user && project) {
      GetReportByProjectId(user, project, start_time, end_time, option_pomo, option_hours)
      .then((report: Report) => {
        this.props.history.push({ // pass data to the next page through redirect
          pathname: '/report',
          state: {
            reportToShow: report,
            userId: this.state.userId,
            optionPomo: option_pomo,
            optionHours: option_hours,
          }
        });
        this.setState({
          reportModalIsOpen: false,
          reportRequested: true
        });
      });
    } else {
      alert("Please check the details!");
    }
  }

  closeReportModal() {
    this.setState({
      reportModalIsOpen: false
    });
  }

  handleStartSession() {
    this.setState({
      startSessionModalIsOpen: true
    });
  }

  afterOpenStartSessionModal() {
    // references are now sync'd and can be accessed.
  }

  closeModalAndStartSession() {
    var associationVal = this.state.selectedAssociationValue as string;
    if (associationVal == "yes") {
      if (this.state.projectNameToAssociate) {
        // get the project ID to associate
        var projIdToAssociate = 0 as number;
        for (var i = 0; i < this.state.projects.length; i++) {
          if (this.state.projects[i].projectname == this.state.projectNameToAssociate) {
            projIdToAssociate = this.state.projects[i].id;
          }
        }
        // create association
        var date = new Date();
        var start_time = date.toISOString();
        this.props.history.push({ // pass data to the next page through redirect
          pathname: '/session',
          state: {
            associatedProjectId: projIdToAssociate,
            associatedProject: this.state.projectNameToAssociate,
            userToAssociate: this.state.userId,
            startTime: start_time,
          }
        });
        this.setState({
          sessionStarted: true,
          startSessionModalIsOpen: false
        });
      } else {
        alert("Please select a project!");
      }
    } else {
      // do not associate with any project, one-time session
      // no need to pass any details because it will not be logged
      this.setState({
        sessionStarted: true,
        startSessionModalIsOpen: false
      });
    }
  }

  closeStartSessionModal() {
    this.setState({
      startSessionModalIsOpen: false
    });
  }

  handleUpdateUserInfo() {
    this.setState({
      updateInfoModalIsOpen: true
    })
  }

  afterUpdateInfoModalOpen() {
  }

  closeModalAndUpdateUserInfo() {
    let firstname = ((document.getElementById('newfirstname') as HTMLInputElement).value)
    let lastname = ((document.getElementById('newlastname') as HTMLInputElement).value)

    if (!firstname) {
      window.alert("First name cannot be empty!");
      return;
    }

    if (!lastname) {
      window.alert("Last name cannot be empty!");
      return;
    }

    this.state.user.firstName = firstname;
    this.state.user.lastName = lastname;
    UpdateUserById(this.state.userId, firstname, lastname, this.state.user.email)
      .then((user: User) => {
        this.setState({
          user: this.state.user,
          updateInfoModalIsOpen: false
        });
      });
  }

  closeUpdateInfoModal() {
    this.setState({
      updateInfoModalIsOpen: false
    });
  }

  handleOptionChange(changeEvent: any) {
    this.setState({
      selectedAssociationValue: changeEvent
    });
  }

  handlePomoOptionChange(changeEvent: any) {
    this.setState({
      selectedCompletedPomoOption: changeEvent
    });
  }

  handleHoursOptionChange(changeEvent: any) {
    this.setState({
      selectedHoursOption: changeEvent
    });
  }

  handleDropdownChange(changeEvent: any) {
    var associate = changeEvent.value as string;
    this.setState({
      projectNameToAssociate: associate
    });
  }

  handleReportDropdownChange(changeEvent: any) {
    var projreport = changeEvent.value as string;
    this.setState({
      projectNameForReport: projreport
    });
  }

  navigateBack() {
    this.setState({
      backPressed: true
    });
  }

  handleDateChangeFrom(date: any) {
    this.setState({
      selectedStartTime: date
    });
  };

  handleDateChangeTo(date: any) {
    this.setState({
      selectedEndTime: date
    });
   };

  render() {

    var classes = ({
      headernav: 'header-nav',
      projDetails: 'project-details',
      editButton: 'button-edit',
      deleteButton: 'button-delete',
      createButton: 'button-create',
      updateInfoButton: 'button-updateinfo',
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
      radioOptions: 'radio-options',
      datePicker: 'date-picker',
    });

    if (this.state.sessionStarted) {
      return (<Redirect push to='/session' />);
    } else if (this.state.backPressed) {
      return (<Redirect push to='/login' />);
    } else if (this.state.reportRequested) {
      return (<Redirect push to='/report' />);
    } else {
    return (
      this.state.dataLoaded ?
        <div className={classes.projectsPage}>
          <h1 id={classes.titleHeader}>User: {`${this.state.user.firstName} ${this.state.user.lastName}`}</h1>
          <p id={classes.titleDesc}>The list of projects that you've created is available below.</p>
          <Button id="createnewproject" className={classes.createButton} variant="contained" style={{ textTransform: "none", marginRight: "10px" }} onClick={this.handleCreateProject.bind(this)}>
            Create a New Project
          </Button>
          <Button id="startsession" className={classes.createButton} variant="contained" style={{ textTransform: "none", marginRight: "10px" }} onClick={this.handleStartSession.bind(this)}>
            Start a New Session
          </Button>
          <Button id="getreportbutton" className={classes.createButton} variant="contained" style={{ textTransform: "none", marginRight: "10px" }} onClick={this.handleGetReport.bind(this)}>
            Get Report
          </Button>
          <Button id="updateinfo" className={classes.createButton} variant="contained" style={{ textTransform: "none", marginRight: "10px" }} onClick={this.handleUpdateUserInfo.bind(this)}>
            Update User Information
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
          <Modal
            isOpen={this.state.startSessionModalIsOpen}
            onAfterOpen={this.afterOpenStartSessionModal}
            onRequestClose={this.closeStartSessionModal}
            style={modalStyle}
            contentLabel="Start New Session"
          >
            <h2 className={classes.modalTitle}>Start New Session</h2>
            <div className={classes.modalDesc}>Do you want to associate this session with a project?</div>
            <div className={classes.radioOptions}>
              <RadioGroup name="associate" selectedValue={this.state.selectedAssociationValue} onChange={this.handleOptionChange}>
                  <Radio value="yes"/><span>Yes</span>
                  <Radio value="no"/><span>No</span>
              </RadioGroup>
            </div>
            {this.state.selectedAssociationValue == "yes" &&
              <Dropdown options={this.state.projects.map(a => a.projectname)} value={this.state.projectNameToAssociate} onChange={this.handleDropdownChange} placeholder="Select a project" />
            }
            <div className={classes.modalActionContainer}>
              <Button className={classes.modalAction} onClick={this.closeModalAndStartSession.bind(this)} variant="text" style={{ textTransform: "none" }} id="okbuttonstartsession">OK</Button>
              <Button className={classes.modalAction} onClick={this.closeStartSessionModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelbuttonstartsession">Cancel</Button>
            </div>
          </Modal>
          <Modal
            isOpen={this.state.reportModalIsOpen}
            onRequestClose={this.closeReportModal}
            style={modalStyle}
            contentLabel="Get Report"
          >
            <h2 className={classes.modalTitle}>Get Report</h2>
            <div className={classes.modalDesc}>Fill in the options below to generate a report of your sessions.</div>
            <Dropdown options={this.state.projects.map(a => a.projectname)} value={this.state.projectNameForReport} onChange={this.handleReportDropdownChange} placeholder="Select a project" />
            <div className={classes.modalDesc} style={{ marginBottom: "10px", marginTop: "10px" }}>From time:</div>
            <div className={classes.datePicker}>
              <DatePicker
                selected={this.state.selectedStartTime}
                onChange={this.handleDateChangeFrom}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                timeCaption="time"
              />
            </div>
            <div className={classes.modalDesc} style={{ marginBottom: "10px", marginTop: "5px" }}>To time:</div>
            <div className={classes.datePicker}>
              <DatePicker
                selected={this.state.selectedEndTime}
                onChange={this.handleDateChangeTo}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                timeCaption="time"
              />
            </div>
            <div className={classes.modalDesc}>Include completed pomodoros?</div>
            <div className={classes.radioOptions}>
              <RadioGroup name="associatepomo" selectedValue={this.state.selectedCompletedPomoOption} onChange={this.handlePomoOptionChange}>
                  <Radio value="yes"/><span>Yes</span>
                  <Radio value="no"/><span>No</span>
              </RadioGroup>
            </div>
            <div className={classes.modalDesc}>Include total hours worked on project?</div>
            <div className={classes.radioOptions}>
              <RadioGroup name="associatehour" selectedValue={this.state.selectedHoursOption} onChange={this.handleHoursOptionChange}>
                  <Radio value="yes"/><span>Yes</span>
                  <Radio value="no"/><span>No</span>
              </RadioGroup>
            </div>
            <div className={classes.modalActionContainer}>
              <Button className={classes.modalAction} onClick={this.closeModalAndGetReport.bind(this)} variant="text" style={{ textTransform: "none" }} id="okbuttonreport">OK</Button>
              <Button className={classes.modalAction} onClick={this.closeReportModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelbuttonreport">Cancel</Button>
            </div>
          </Modal>
          <Modal
            isOpen={this.state.updateInfoModalIsOpen}
            onAfterOpen={this.afterUpdateInfoModalOpen}
            onRequestClose={this.closeUpdateInfoModal}
            style={modalStyle}
            contentLabel="Update User Information"
          >
            <h2 className={classes.modalTitle}>Update User Information</h2>
            <div className={classes.modalDesc}>Enter your updated details below:</div>
            <TextField className={classes.modalInput} id="newfirstname" label="First Name" type="email" fullWidth autoFocus required />
            <TextField className={classes.modalInput} id="newlastname" label="Last Name" type="email" fullWidth autoFocus required />
            <div className={classes.modalActionContainer}>
              <Button className={classes.modalAction} onClick={this.closeModalAndUpdateUserInfo.bind(this)} variant="text" style={{ textTransform: "none" }} id="okbuttonupdate">OK</Button>
              <Button className={classes.modalAction} onClick={this.closeUpdateInfoModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelbuttonupdate">Cancel</Button>
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
                  <div>Actions</div>
                </Grid>
              </Grid>

              {this.state.projects.map((currentProject, i) =>
                <ListItem key={currentProject.id} className={classes.projDetails}>
                  <Grid container spacing={8} alignItems="flex-end" className={classes.projitem} style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Grid item md={true} sm={true} xs={true} id="project_id">
                      {currentProject.id}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true} id="project_name">
                      {currentProject.projectname}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true} id="project_actions">
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
          <Button id="backbutton" className={classes.createButton} variant="contained" style={{ textTransform: "none", marginRight: "10px", marginTop: "20px" }} onClick={this.navigateBack.bind(this)}>
            Back
          </Button>
        </div> :
        <div id="center" className={classes.spinnerDiv}>
          <ClipLoader>
          </ClipLoader>
        </div>
    );
    }
  }

}

export default UserPage;