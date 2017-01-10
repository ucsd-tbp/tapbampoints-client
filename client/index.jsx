import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './containers/App';

import AdminDashboard from './components/AdminDashboard';
import FilterableEventList from './components/FilterableEventList';
import LoginForm from './components/LoginForm';

// Includes all styles imported into `main.scss`.
require('./static/stylesheets/main.scss');

ReactDOM.render((
  // TODO Configure server to use browser history.
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={FilterableEventList} />

      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/login" component={LoginForm} />

    </Route>
  </Router>
), document.getElementById('main-container'));
