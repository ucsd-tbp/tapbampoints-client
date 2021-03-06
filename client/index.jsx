/**
 * @file Entry point for the application. Defines the routes and renders the
 * root React component into the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import { Roles } from './modules/constants';
import Hooks from './modules/Hooks';

import withSimplePresentation from './modules/transforms';

import App from './containers/App';
import ProfileContainer from './containers/ProfileContainer';
import UpdateProfileContainer from './containers/UpdateProfileContainer';
import VerifyAccountContainer from './containers/VerifyAccountContainer';

import AdminDashboard from './pages/AdminDashboard';
import AuthenticationPage from './pages/AuthenticationPage';
import CreateAnnouncementPage from './pages/CreateAnnouncementPage';
import CurrentEventsPage from './pages/CurrentEventsPage';
import EventSigninPage from './pages/EventSigninPage';
import GoogleCalendarEventsPage from './pages/GoogleCalendarEventsPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import StatisticsPage from './pages/StatisticsPage';

// Includes all styles imported into `main.scss`.
require('./static/stylesheets/main.scss');

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />

      {/* Routes that don't require login. */}
      <Route path="/login" component={AuthenticationPage} onEnter={Hooks.requireLogout} />
      <Route path="/events" component={CurrentEventsPage} />
      <Route path="/claim/:userID" component={withSimplePresentation(VerifyAccountContainer, 'Claim Account')} />

      {/* Routes that require user login. */}
      <Route onEnter={Hooks.protectRouteFor(Roles.MEMBER)}>
        <Route path="/profile" component={withSimplePresentation(ProfileContainer, 'Profile')} />
        <Route path="/profile/update" component={withSimplePresentation(UpdateProfileContainer, 'Update Profile')} />
      </Route>

      {/* Routes that require the admin role. */}
      <Route path="/admin" onEnter={Hooks.protectRouteFor(Roles.OFFICER)}>
        <IndexRoute component={AdminDashboard} />

        {/* Pages for creating events, viewing events, event sign-ins. */}
        <Route path="/admin/events/create" component={GoogleCalendarEventsPage} />
        <Route path="/admin/announcements/create" component={CreateAnnouncementPage} />
        <Route path="/admin/events/register/:eventID" component={EventSigninPage} />

        {/* Sign-up related statistics. */}
        <Route path="/admin/statistics" component={StatisticsPage} />
      </Route>

      {/* Renders 404 page if none of the above routes match. */}
      <Route path="*" component={NotFoundPage} />

    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('main-container'));
