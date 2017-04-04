import React from 'react';
import { browserHistory } from 'react-router';
import { scroller } from 'react-scroll';
import { mapKeys, snakeCase } from 'lodash';

import RegistrationForm from '../components/RegistrationForm';
import { EMAIL_REGEX, Houses, MIN_PASSWORD_LENGTH, Roles, SCROLL_ANIMATION_CONFIG } from '../modules/constants';
import Auth from '../modules/Auth';
import API from '../modules/API';
import Events from '../modules/Events';

function validate(credentials) {
  const errors = [];

  if (!credentials.firstName || !credentials.lastName) {
    errors.push('First or last name can\'t be blank.');
  }

  if (!EMAIL_REGEX.test(credentials.email)) {
    errors.push('Email has an invalid format.');
  }

  if (credentials.password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password has to be at least ${MIN_PASSWORD_LENGTH} characters.`);
  } else if (credentials.password !== credentials.passwordConfirmation) {
    errors.push('Passwords don\'t match.');
  }

  if (!Events.parsePID(credentials.pid)) {
    errors.push('PID is invalid.');
  }

  return errors;
}

class RegistrationFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      credentials: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        pid: '',
        house: Houses.NONE,
        role: Roles.INITIATE,
      },

      errors: [],
    };
  }

  handleChange(event) {
    const credentials = this.state.credentials;
    credentials[event.target.name] = event.target.value;

    this.setState({ credentials });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (validate(this.state.credentials).length > 0) {
      this.setState({ errors: validate(this.state.credentials) });
      scroller.scrollTo('ErrorMessagesList', SCROLL_ANIMATION_CONFIG);
      return;
    }

    let credentials = this.state.credentials;
    credentials = mapKeys(credentials, (value, key) => snakeCase(key));
    delete credentials.password_confirmation;

    API.registerUser(credentials, true)
      .then(() => Auth.verifyToken())
      .then((user) => {
        this.props.onAuthChange(user);
        browserHistory.push('/');
      })
      .catch((errors) => {
        console.error(errors);
        this.setState({ errors: errors.errors.map(error => error.msg) });
        scroller.scrollTo('ErrorMessagesList', SCROLL_ANIMATION_CONFIG);
      });
  }

  render() {
    return (
      <RegistrationForm
        credentials={this.state.credentials}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        errors={this.state.errors}
      />
    );
  }
}

RegistrationFormContainer.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default RegistrationFormContainer;
