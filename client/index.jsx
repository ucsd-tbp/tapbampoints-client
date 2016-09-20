import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import App from './components/App';
import AdminDashboard from './components/AdminDashboard';
import FilterableEventList from './components/FilterableEventList';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="/dashboard" component={AdminDashboard} />
      <Route path="/events" component={FilterableEventList} />
    </Route>
  </Router>
), document.getElementById('main-container'));
