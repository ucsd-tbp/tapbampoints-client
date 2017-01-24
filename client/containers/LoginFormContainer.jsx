import React from 'react';
import { browserHistory } from 'react-router';
import 'whatwg-fetch';

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

    Auth.authenticateUser(this.state.credentials.email, this.state.credentials.password)
      .then(() => {
        // Notifies root-level component that login has occurred.
        this.props.onAuthChange(true);

        // Redirects to index route.
        browserHistory.push('/');
      })
      .catch(error => console.error(error.error));
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
