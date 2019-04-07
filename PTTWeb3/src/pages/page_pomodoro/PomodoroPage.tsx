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

// match the id paremeter from the path.
interface MatchParam {
    id: string
}

interface PomodoroPageProps extends RouteComponentProps<MatchParam> {

}

// store session data.
interface PomodoroPageState {
    sessionId: number,
    imageUrl: string
    inWorkPhase: boolean,
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
        sessionId: parseInt(props.match.params.id, 10),
        imageUrl: require("../../assets/large_pomodoro.png"),
        inWorkPhase: true,
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
    alert("Stop session clicked"); // TODO
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

    return (
        <div className={classes.projectsPage}>
          <h1 id={classes.titleHeader}>Session ID: {this.state.sessionId}</h1>
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
                            // toggle the state
                            this.setState({
                                imageUrl: require("../../assets/large_pomodoro.png"),
                                inWorkPhase: true
                            });
                            if (confirm("continue?")) {
                                (document.getElementById("restTimer") as HTMLDivElement).className += " hidden-element";
                                (document.getElementById("workTimer") as HTMLDivElement).className = "timer-div";
                                (document.getElementById("work_resetButton") as HTMLButtonElement).click();
                                (document.getElementById("work_startButton") as HTMLButtonElement).click();
                            } else {
                                // do nothing
                            }
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

export default PomodoroPage;