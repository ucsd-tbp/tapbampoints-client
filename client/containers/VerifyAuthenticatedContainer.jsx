import React from 'react';
import { browserHistory } from 'react-router';

import Auth from '../modules/Auth';

class VerifyAuthenticatedContainer extends React.Component {
  componentDidMount() {
    if (!Auth.isUserAuthenticated())
      browserHistory.replace('/login');
  }

  render() {
    return Auth.isUserAuthenticated() ? this.props.children : null;
  }
}

export default VerifyAuthenticatedContainer;
