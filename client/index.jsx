import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import AdminDashboard from './pages/AdminDashboard';
import App from './pages/App';
import AuthenticationPage from './pages/AuthenticationPage';
import EventRegistrationPage from './pages/EventRegistrationPage';
import UpcomingEventsPage from './pages/UpcomingEventsPage';

import VerifyAuthenticatedContainer from './containers/VerifyAuthenticatedContainer';

// Includes all styles imported into `main.scss`.
require('./static/stylesheets/main.scss');

// TODO Protect routes based on logged in or admin status.
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={UpcomingEventsPage} />

      <Route path="/login" component={AuthenticationPage} />

      <Route component={VerifyAuthenticatedContainer}>
      </Route>

      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/users" component={AdminDashboard} />
      <Route path="/events/register/:eventID" component={EventRegistrationPage} />

    </Route>
  </Router>
), document.getElementById('main-container'));
