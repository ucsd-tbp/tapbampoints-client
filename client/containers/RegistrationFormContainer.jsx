import React from 'react';
import { browserHistory } from 'react-router';

import RegistrationForm from '../components/RegistrationForm';
import { EMAIL_REGEX, Houses, MIN_PASSWORD_LENGTH, Roles } from '../modules/constants';
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

  if (credentials.password < MIN_PASSWORD_LENGTH) {
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

    this.setState({ errors: validate(this.state.credentials) });
    if (validate(this.state.credentials).length > 0) return;

    API.registerUser(this.state.credentials, true)
      .then(() => Auth.verifyToken())
      .then((user) => {
        this.props.onAuthChange(user);
        browserHistory.push('/');
      })
      .catch(errors => this.setState({ errors: errors.map(error => error.msg) }));
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
