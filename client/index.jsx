/**
 * @file Entry point for the application. Defines the routes and renders the
 * root React component into the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './containers/App';

import AdminDashboard from './pages/AdminDashboard';
import AuthenticationPage from './pages/AuthenticationPage';
import EventRegistrationPage from './pages/EventRegistrationPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import StatisticsPage from './pages/StatisticsPage';
import UpcomingEventsPage from './pages/UpcomingEventsPage';

// Includes all styles imported into `main.scss`.
require('./static/stylesheets/main.scss');

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={UpcomingEventsPage} />

      {/* Routes that don't require login. */}
      <Route path="/login" component={AuthenticationPage} />

      {/* Routes that require user login. */}
      <Route onEnter={() => console.warn('entering logged in section')}>
        <Route path="/profile" component={ProfilePage} />
      </Route>

      {/* Routes that require the admin role. */}
      <Route path="/admin" onEnter={() => console.warn('entering admin section')}>
        <IndexRoute component={AdminDashboard} />
        <Route path="/admin/statistics" component={StatisticsPage} />
        <Route path="/admin/events/register/:eventID" component={EventRegistrationPage} />
      </Route>

      <Route path="*" component={NotFoundPage} />

    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('main-container'));
