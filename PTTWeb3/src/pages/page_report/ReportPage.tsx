import React from 'react';
import Dropdown from 'react-dropdown';
import { RouteComponentProps } from 'react-router';
import { Radio, RadioGroup } from 'react-radio-group';
import Modal from 'react-modal';
import { ClipLoader } from 'react-spinners';
import { User, Project, Report } from '../../models';
import { List, ListItem, Paper, withStyles, Grid, TextField, Button, FormControlLabel, Checkbox, Backdrop } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import { FetchProjectsByUserId, FetchUserById, DeleteProjectById, CreateNewProject, UpdateUserById } from '../../RESTful-APIs';
import { Redirect } from 'react-router-dom';

interface ReportPageProps extends RouteComponentProps {

}

// store report data.
interface ReportPageState {
    //report: Report,
    dataLoaded: boolean,
    backPressed: boolean,
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

class ReportPage extends React.Component<ReportPageProps, ReportPageState> {

  state: ReportPageState
  _isMounted: boolean

  constructor(props: ReportPageProps) {
    super(props);
    this.state = {
      dataLoaded: true,
      backPressed: false,
    }
    this._isMounted = false;

    this.navigateBack = this.navigateBack.bind(this);
  }

  // this function will be called right before render function.
  // make RESTful api calls here to populate data.
  componentWillMount() {
  }

  navigateBack() {
    this.setState({
      backPressed: true
    });
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
    });

    var report = this.props.location.state.reportToShow as Report;

    if (this.state.backPressed) {
      return (<Redirect push to={'/user/' + this.props.location.state.userId} />);
    } else {
    return (
      this.state.dataLoaded ?
        <div className={classes.projectsPage}>
          <h1 id={classes.titleHeader}>Report</h1>
          <p id={classes.titleDesc}>The report you requested is shown below.</p>
          {this.props.location.state && this.props.location.state.optionPomo &&
            <Grid item md={true} sm={true} xs={true} id="optionpomolabel">
              <p>Completed pomodoros: {report.completedPomodoros}</p>
            </Grid>}
          {this.props.location.state && this.props.location.state.optionHours &&
            <Grid item md={true} sm={true} xs={true} id="optionhourslabel">
              <p>Total hours worked on project: {report.totalHoursWorkedOnProject}</p>
            </Grid>}
          <Paper style={{ maxWidth: 800, marginTop: 30 }}>
            <List className={classes.projectList}>
              <Grid container spacing={8} alignItems="flex-end" className={classes.headernav}>
                <Grid item md={true} sm={true} xs={true}>
                  <div>Session Sr. No.</div>
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <div>Starting Time</div>
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <div>Ending Time</div>
                </Grid>
                <Grid item md={true} sm={true} xs={true}>
                  <div>Hours Worked</div>
                </Grid>
              </Grid>
            </List>

            {report.sessions.map((currentSession, i) =>
                <ListItem key={i} className={classes.projDetails}>
                  <Grid container spacing={8} alignItems="flex-end" className={classes.projitem} style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Grid item md={true} sm={true} xs={true} id="sessionsrno">
                      {i}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true} id="sttime">
                      {currentSession.startingTime}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true} id="endtime">
                      {currentSession.endingTime}
                    </Grid>
                    <Grid item md={true} sm={true} xs={true} id="hours">
                      {currentSession.hoursWorked}
                    </Grid>
                  </Grid>
                </ListItem>)}

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

export default ReportPage;