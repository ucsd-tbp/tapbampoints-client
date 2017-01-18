import React from 'react';
import { browserHistory } from 'react-router';
import 'whatwg-fetch';

import API from '../modules/API';
import Auth from '../modules/Auth';

import LoginForm from '../components/LoginForm';

/**
 * Container component that handles the logic for logging a user in via the
 * credentials given in the LoginForm component.
 */
class LoginFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      credentials: {
        email: '',
        password: '',
      },
    };
  }

  /** Updates credentials based on user input given in login form. */
  handleChange(event) {
    const credentials = this.state.credentials;
    credentials[event.target.name] = event.target.value;

    this.setState({ credentials });
  }

  /**
   * Logs in a user by making a POST request with the email and password
   * credentials in the request body. On successful response status code, logs
   * the user in by storing the JWT received in the response into local
   * storage.
   */
  handleSubmit(event) {
    event.preventDefault();

    // Builds request with credentials in request body.
    const request = new Request(`${process.env.API_ROOT}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: this.state.credentials.email,
        password: this.state.credentials.password,
      }),
    });

    // Makes POST request to log in user with given credentials.
    fetch(request)
      .then(API.checkStatus)
      .then(response => Promise.all([response, response.json()]))
      .then((data) => {
        // Stores JWT and notifies application that user has logged in.
        Auth.authenticateUser(data.token);
        this.props.onAuthChange(true);

        // Redirects to index route.
        browserHistory.push('/');
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <LoginForm
        credentials={this.state.credentials}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

LoginFormContainer.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default LoginFormContainer;
