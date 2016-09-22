import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './components/App';
import AdminDashboard from './components/AdminDashboard';
import FilterableEventList from './components/FilterableEventList';

require('./static/stylesheets/main.scss');

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={FilterableEventList} />
      <Route path="/dashboard" component={AdminDashboard} />
    </Route>
  </Router>
), document.getElementById('main-container'));
