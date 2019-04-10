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

    if (this.state.backPressed) {
      return (<Redirect push to={'/user/' + this.props.location.state.userId} />);
    } else {
    return (
      this.state.dataLoaded ?
        <div className={classes.projectsPage}>
          <h1 id={classes.titleHeader}>Report</h1>
          <p id={classes.titleDesc}>The report you requested is shown below.</p>
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