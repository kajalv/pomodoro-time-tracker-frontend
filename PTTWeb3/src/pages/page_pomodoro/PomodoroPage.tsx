import React from 'react';
import Dropdown from 'react-dropdown';
import { RouteComponentProps } from 'react-router';
import { Radio, RadioGroup } from 'react-radio-group';
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { User, Project } from '../../models';
import { List, ListItem, Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { FetchProjectsByUserId, FetchUserById, DeleteProjectById, CreateNewProject, UpdateUserById } from '../../RESTful-APIs';
import { Redirect } from 'react-router-dom';
import Timer from 'react-compound-timer';
import { ShortText } from '@material-ui/icons';
import { CreateNewSession } from '../../RESTful-APIs';

interface PomodoroPageProps extends RouteComponentProps {

}

// store session data.
interface PomodoroPageState {
    imageUrl: string
    inWorkPhase: boolean,
    startAnotherPomodoroModalIsOpen: boolean,
    stopPartialPomodoroModalIsOpen: boolean,
    sessionEnded: boolean,
    pomodorosCompleted: number,
    endTimeOfLastPomodoro: string,
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

class PomodoroPage extends React.Component<PomodoroPageProps, PomodoroPageState> {

  state: PomodoroPageState
  _isMounted: boolean

  constructor(props: PomodoroPageProps) {
    super(props);
    this.state = {
        imageUrl: require("../../assets/large_pomodoro.png"),
        inWorkPhase: true,
        startAnotherPomodoroModalIsOpen: false,
        stopPartialPomodoroModalIsOpen: false,
        sessionEnded: false,
        pomodorosCompleted: 0,
        endTimeOfLastPomodoro: "",
    }
    this._isMounted = false;

    this.handleStopSession = this.handleStopSession.bind(this);
  }

  // this function will be called right before render function. 
  // make RESTful api calls here to populate data.
  componentWillMount() {
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleStopSession() {
    // pause timer
    if (this.state.inWorkPhase) {
        (document.getElementById("work_pauseButton") as HTMLButtonElement).click();
    } else {
        (document.getElementById("rest_pauseButton") as HTMLButtonElement).click();
    }

    if (this.isThereAProjectToAssociate()) {
      this.setState({
          stopPartialPomodoroModalIsOpen: true
      });
    } else {
      // just end the session
      this.setState({
        sessionEnded: true
      });
    }
  }

  closeModalAndStartAnotherPomodoro() {
    // continue session, start another pomodoro
    (document.getElementById("restTimer") as HTMLDivElement).className += " hidden-element";
    (document.getElementById("workTimer") as HTMLDivElement).className = "timer-div";
    (document.getElementById("work_resetButton") as HTMLButtonElement).click();
    (document.getElementById("work_startButton") as HTMLButtonElement).click();
    this.setState({
        startAnotherPomodoroModalIsOpen: false
    })
  }

  closeStartAnotherPomodoroModal() {
    // don't start another pomodoro, end session
    if (this.props.location.state && this.props.location.state.userToAssociate && this.props.location.state.startTime && this.isThereAProjectToAssociate() && this.props.location.state.associatedProjectId) {
      // only if the user and project details are available, log the data
      var date = new Date();
      var end_time = date.toISOString();
      CreateNewSession(this.props.location.state.userToAssociate, this.props.location.state.associatedProjectId, this.props.location.state.startTime, end_time, this.state.pomodorosCompleted)
      .then(() => {
        this.setState({
          startAnotherPomodoroModalIsOpen: false,
          sessionEnded: true
        });
      }); 
    } else {
      this.setState({
        startAnotherPomodoroModalIsOpen: false,
        sessionEnded: true
      });
    }
  }

  closeModalAndLogPartialPomodoro() {
    // close modal, log info
    if (this.props.location.state && this.props.location.state.userToAssociate && this.props.location.state.startTime && this.isThereAProjectToAssociate() && this.props.location.state.associatedProjectId) {
      // only if the user and project details are available, log the data
      var date = new Date();
      var end_time = date.toISOString();
      CreateNewSession(this.props.location.state.userToAssociate, this.props.location.state.associatedProjectId, this.props.location.state.startTime, end_time, this.state.pomodorosCompleted)
      .then(() => {
        this.setState({
          stopPartialPomodoroModalIsOpen: false,
          sessionEnded: true
        });
      }); 
    } else {
      this.setState({
        stopPartialPomodoroModalIsOpen: false,
        sessionEnded: true
      });
    }
  }

  closeModalAndEndSession() {
    // close modal and end session, but do not log partial info
    if (this.state.pomodorosCompleted > 0 && this.props.location.state && this.props.location.state.userToAssociate && this.props.location.state.startTime && this.isThereAProjectToAssociate() && this.props.location.state.associatedProjectId) {
      // only if the user and project details are available, log the data
      // and only if there was something completed i.e. pomodorosCompleted > 0
      CreateNewSession(this.props.location.state.userToAssociate, this.props.location.state.associatedProjectId, this.props.location.state.startTime, this.state.endTimeOfLastPomodoro, this.state.pomodorosCompleted)
      .then(() => {
        this.setState({
          stopPartialPomodoroModalIsOpen: false,
          sessionEnded: true
        });
      }); 
    } else {
      this.setState({
        stopPartialPomodoroModalIsOpen: false,
        sessionEnded: true
      });
    }
  }

  closePartialPomodoroModal() {
    // continue the pomodoro
    this.setState({
        stopPartialPomodoroModalIsOpen: false
    });

    // resume timer
    if (this.state.inWorkPhase) {
        (document.getElementById("work_resumeButton") as HTMLButtonElement).click();
    } else {
        (document.getElementById("rest_resumeButton") as HTMLButtonElement).click();
    }
  }

  endSessionAndNavigateBack() {
    this.setState({
      sessionEnded: true
    });
  }

  isThereAProjectToAssociate() {
    var result = (this.props.location.state && this.props.location.state.associatedProject);
    return result;
  }

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
      pomodoroPage: 'pomodoroPage',
      timerDiv: 'timer-div',
      hiddenElement: 'hidden-element',
    });

    if (this.state.sessionEnded) {
      return (<Redirect push to={'/user/' + this.props.location.state.userToAssociate} />);
    } else {
    return (
        <div className={classes.projectsPage}>
          <h1 id={classes.titleHeader}>Session Ongoing</h1>
          {this.isThereAProjectToAssociate() &&
            <Grid item md={true} sm={true} xs={true} id="projectlabel">
              <p>Associated project: {this.props.location.state.associatedProject}</p>
            </Grid>}
          <Grid item md={true} sm={true} xs={true} id="pomodorosCompletedLabel">
            <p>Pomodoros completed: {this.state.pomodorosCompleted}</p>
          </Grid>
          <Button id="stopsession" className={classes.createButton} variant="contained" style={{ textTransform: "none", marginRight: "10px" }} onClick={this.handleStopSession.bind(this)}>
            Stop this session
          </Button>
          <div className={classes.pomodoroPage}>
            {this.state.inWorkPhase &&
                <Grid item md={true} sm={true} xs={true} className="phase" id="worklabel">
                    <p>Get to work!</p>
                </Grid>
            }
            {!this.state.inWorkPhase &&
                <Grid item md={true} sm={true} xs={true} className="phase" id="restlabel">
                    <p>Take a break!</p>
                </Grid>
            }
            <br/>
            <img src={this.state.imageUrl}></img>
          </div>
          <Modal
            isOpen={this.state.startAnotherPomodoroModalIsOpen}
            onRequestClose={this.closeStartAnotherPomodoroModal}
            style={modalStyle}
            contentLabel="Continue Session?"
            >
            <h2 className={classes.modalTitle}>Start Another Pomodoro</h2>
            <div className={classes.modalDesc}>Do you want to start another pomodoro?</div>
            <div className={classes.modalActionContainer}>
                <Button className={classes.modalAction} onClick={this.closeModalAndStartAnotherPomodoro.bind(this)} variant="text" style={{ textTransform: "none" }} id="startanotherbutton">Yes</Button>
                <Button className={classes.modalAction} onClick={this.closeStartAnotherPomodoroModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelanotherbutton">No</Button>
            </div>
          </Modal>
          <Modal
            isOpen={this.state.stopPartialPomodoroModalIsOpen}
            onRequestClose={this.closePartialPomodoroModal}
            style={modalStyle}
            contentLabel="Continue Session?"
            >
            <h2 className={classes.modalTitle}>End Session</h2>
            <div className={classes.modalDesc}>Do you want to log the partial pomodoro time?</div>
            <div className={classes.modalActionContainer}>
                <Button className={classes.modalAction} onClick={this.closeModalAndLogPartialPomodoro.bind(this)} variant="text" style={{ textTransform: "none" }} id="logpartialbutton">Yes</Button>
                <Button className={classes.modalAction} onClick={this.closeModalAndEndSession.bind(this)} variant="text" style={{ textTransform: "none" }} id="endsessionbutton">No</Button>
                <Button className={classes.modalAction} onClick={this.closePartialPomodoroModal.bind(this)} variant="text" style={{ textTransform: "none" }} id="cancelpartialbutton">Cancel</Button>
            </div>
          </Modal>
          <div id="timerContainer">
            <div className={classes.timerDiv} id="workTimer">
                <Timer
                    initialTime={5000} /*value is in milliseconds*/ /*1200000 for 20 mins*/
                    direction="backward"
                    onStart={() => {}}
                    onResume={() => {}}
                    onPause={() => {}}
                    onStop={() => {}}
                    onReset={() => {}}
                    checkpoints={[
                        {
                            time: 0,
                            callback: () => {
                                // the timer has expired
                                // toggle the state
                                this.setState({
                                    imageUrl: require("../../assets/coffee.png"),
                                    inWorkPhase: false
                                });
                                (document.getElementById("workTimer") as HTMLDivElement).className += " hidden-element";
                                (document.getElementById("restTimer") as HTMLDivElement).className = "timer-div";
                                (document.getElementById("rest_resetButton") as HTMLButtonElement).click();
                                (document.getElementById("rest_startButton") as HTMLButtonElement).click();
                            },
                        }
                    ]}
                >
                    {( { start, stop, pause, resume, reset } : { start: any, stop : any, pause: any, resume: any, reset: any } ) => (
                        <React.Fragment>
                            <div>
                                <Timer.Minutes /> : <Timer.Seconds />
                            </div>
                            <div id="workButtons">
                                <button id="work_startButton" onClick={start}>Start Rest Phase</button>
                                <button id="work_pauseButton" onClick={pause}>Pause</button>
                                <button id="work_resumeButton" onClick={resume}>Resume</button>
                                <button id="work_stopButton" onClick={stop}>Start</button>
                                <button id="work_resetButton" onClick={reset}>Reset to Work Phase</button>
                            </div>
                        </React.Fragment>
                    )}
                </Timer>
            </div>
            <div className="timer-div hidden-element" id="restTimer">
            <Timer
                initialTime={3000} /*value is in milliseconds*/ /*1200000 for 20 mins*/
                direction="backward"
                startImmediately={false}
                onStart={() => {}}
                onResume={() => {}}
                onPause={() => {}}
                onStop={() => {}}
                onReset={() => {}}
                checkpoints={[
                    {
                        time: 0,
                        callback: () => {
                            // the timer has expired
                            // increment the number of pomodoros completed
                            this.state.pomodorosCompleted = this.state.pomodorosCompleted + 1;
                            var date = new Date();
                            this.state.endTimeOfLastPomodoro = date.toISOString();
                            // toggle the state
                            this.setState({
                                imageUrl: require("../../assets/large_pomodoro.png"),
                                inWorkPhase: true,
                                startAnotherPomodoroModalIsOpen: true
                            });
                            //depending on the dialog outcome, action will be taken
                        },
                    }
                ]}
            >
                {( { start, stop, pause, resume, reset } : { start: any, stop : any, pause: any, resume: any, reset: any } ) => (
                    <React.Fragment>
                        <div>
                            <Timer.Minutes /> : <Timer.Seconds />
                        </div>
                        <div id="restButtons">
                            <button id="rest_startButton" onClick={start}>Start Rest Phase</button>
                            <button id="rest_pauseButton" onClick={pause}>Pause</button>
                            <button id="rest_resumeButton" onClick={resume}>Resume</button>
                            <button id="rest_stopButton" onClick={stop}>Start</button>
                            <button id="rest_resetButton" onClick={reset}>Reset to Work Phase</button>
                        </div>
                    </React.Fragment>
                )}
            </Timer>
          </div>
          </div>
        </div>
    );
  }
  }

}

export default PomodoroPage;