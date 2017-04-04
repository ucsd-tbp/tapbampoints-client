import React from 'react';
import { browserHistory } from 'react-router';
import 'whatwg-fetch';
import { scroller } from 'react-scroll';

import Auth from '../modules/Auth';
import { EMAIL_REGEX, SCROLL_ANIMATION_CONFIG } from '../modules/constants';

import LoginForm from '../components/LoginForm';

function validate(credentials) {
  const errors = [];

  if (!EMAIL_REGEX.test(credentials.email)) {
    errors.push('Email is formatted incorrectly.');
  }

  if (credentials.password.length <= 0) {
    errors.push('Password can\'t be empty.');
  }

  return errors;
}

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

      errors: [],
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

    if (validate(this.state.credentials).length > 0) {
      this.setState({ errors: validate(this.state.credentials) });
      scroller.scrollTo('ErrorMessagesList', SCROLL_ANIMATION_CONFIG);
      return;
    }

    Auth.authenticateUser(this.state.credentials.email, this.state.credentials.password)
      .then(() => Auth.verifyToken())
      .then((user) => {
        // Notifies root-level component that login has occurred.
        this.props.onAuthChange(user);

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
        errors={this.state.errors}
      />
    );
  }
}

LoginFormContainer.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default LoginFormContainer;
