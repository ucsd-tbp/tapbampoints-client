import React from 'react';
import { map } from 'lodash';
import { browserHistory } from 'react-router';
import { scroller } from 'react-scroll';

import API from '../modules/API';
import Auth from '../modules/Auth';
import { EMAIL_REGEX, Houses, MIN_PASSWORD_LENGTH, Roles, SCROLL_ANIMATION_CONFIG } from '../modules/constants';

import RegistrationForm from '../components/RegistrationForm';
import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

function validate(credentials) {
  const errors = [];

  if (!EMAIL_REGEX.test(credentials.email)) {
    errors.push('Email has an invalid format.');
  }

  if (credentials.password.length > 0) {
    if (credentials.password.length < MIN_PASSWORD_LENGTH) {
      errors.push(`Password has to be at least ${MIN_PASSWORD_LENGTH} characters.`);
    } else if (credentials.password !== credentials.passwordConfirmation) {
      errors.push('Passwords don\'t match.');
    }
  }

  return errors;
}

class UpdateProfileContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      userID: 0,

      credentials: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        pid: '',
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

    API.updateUser(this.state.credentials, this.state.userID)
      .then(() => browserHistory.push('/profile'))
      .catch((errors) => {
        this.setState({ errors: errors.errors.map(error => error.msg) });
        scroller.scrollTo('ErrorMessagesList', SCROLL_ANIMATION_CONFIG);
      });
  }

  componentDidMount() {
    Auth.verifyToken()
      .then((user) => {
        const credentials = {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          pid: user.pid,
          password: '',
          passwordConfirmation: '',
        };

        this.setState({ userID: user.id, credentials });
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <FlexContainer>
        <FlexItem className="equal-width">
          <p>
            You can update your profile information here! Because of how we track event attendance,
            you can't directly update your PID (let an officer know if the PID listed in the form is
            incorrect).
          </p>

          <p>
            Check your profile to see which house you're in and your active membership status.
          </p>
        </FlexItem>
        <FlexItem className="equal-width horizontal-padding">
          <RegistrationForm
            credentials={this.state.credentials}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            errors={this.state.errors}
            omittedFields={new Set(['house', 'role',])}
            disabledFields={new Set(['pid'])}
            submitButtonText="Update"
          />
        </FlexItem>
      </FlexContainer>
    );
  }
}

export default UpdateProfileContainer;
