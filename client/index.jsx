import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './containers/App';

import AdminDashboard from './components/AdminDashboard';
import AuthenticationPage from './components/AuthenticationPage';
import EventRegistration from './components/EventRegistration';
import FilterableEventList from './components/FilterableEventList';

// Includes all styles imported into `main.scss`.
require('./static/stylesheets/main.scss');

// TODO Protect routes based on logged in or admin status.
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={FilterableEventList} />
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/login" component={AuthenticationPage} />

      <Route path="/events/register/:eventID" component={EventRegistration} />

    </Route>
  </Router>
), document.getElementById('main-container'));
