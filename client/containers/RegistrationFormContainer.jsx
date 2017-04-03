import React from 'react';

import RegistrationForm from '../components/RegistrationForm';
import { EMAIL_REGEX, Houses, MIN_PASSWORD_LENGTH, Roles } from '../modules/constants';
import Events from '../modules/Events';

class RegistrationFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.validate = this.validate.bind(this);
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

  validate(credentials) {
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

  handleChange(event) {
    const credentials = this.state.credentials;
    credentials[event.target.name] = event.target.value;

    this.setState({ credentials });
  }

  handleSubmit(event) {
    event.preventDefault();

    const errors = this.validate(this.state.credentials);
    this.setState({ errors });

    // this.props.onAuthChange(true);
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
