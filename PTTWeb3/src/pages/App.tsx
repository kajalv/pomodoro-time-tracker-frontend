import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';
import Button from '../components/Button';
import '../constants/index';
import { APP_NAME } from '../constants/index';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './page_login/LoginPage';
import Home from './page_home/HomePage';
import UserPage from './dashboard_user/UserPage';
import AdminPage from './dashboard_admin/AdminPage';
import PomodoroPage from './page_pomodoro/PomodoroPage';

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/user/:id" component={UserPage} />
          <Route path="/adminpage" component={AdminPage} />
          <Route path="/session/:id" component={PomodoroPage} />
        </div>
      </Router>
    );
  }
}

export default App;
