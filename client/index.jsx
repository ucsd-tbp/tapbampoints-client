import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './pages/App';

import AdminDashboard from './pages/AdminDashboard';
import AuthenticationPage from './pages/AuthenticationPage';
import EventRegistrationPage from './pages/EventRegistrationPage';

// Includes all styles imported into `main.scss`.
require('./static/stylesheets/main.scss');

// TODO Protect routes based on logged in or admin status.
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={AdminDashboard} />
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/login" component={AuthenticationPage} />

      <Route path="/events/register/:eventID" component={EventRegistrationPage} />

    </Route>
  </Router>
), document.getElementById('main-container'));
