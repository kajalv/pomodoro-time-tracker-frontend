import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';
import Button from '../components/Button';
import '../constants/index';
import { APP_NAME } from '../constants/index';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './login/LoginPage';
import Home from './Home/HomePage';
import UserPage from './userdashboard/UserPage';
import AdminPage from './admindashboard/AdminPage';

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/userpage" component={UserPage} />
          <Route path="/adminpage" component={AdminPage} />
        </div>
      </Router>
    );
  }
}

export default App;
