import React from 'react';
import { scroller } from 'react-scroll';
import { browserHistory } from 'react-router';

import RegistrationForm from '../components/RegistrationForm';
import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';
import { Houses, Roles, SCROLL_ANIMATION_CONFIG, MIN_PASSWORD_LENGTH } from '../modules/constants';
import API from '../modules/API';
import Auth from '../modules/Auth';

function validate(credentials) {
  const errors = [];

  if (!credentials.firstName || !credentials.lastName) {
    errors.push('First or last name can\'t be blank.');
  }

  if (credentials.password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password has to be at least ${MIN_PASSWORD_LENGTH} characters.`);
  } else if (credentials.password !== credentials.passwordConfirmation) {
    errors.push('Passwords don\'t match.');
  }

  return errors;
}

class VerifyAccountContainer extends React.Component {
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

      validVerification: false,
      resendToEmail: '',

      errors: [],
    };
  }

  componentDidMount() {
    API.retrieveUserFromVerification(this.props.location.query.id, this.props.location.query.token)
      .then((user) => {
        const credentials = {
          firstName: '',
          lastName: '',
          email: user.email,
          password: '',
          passwordConfirmation: '',
          pid: user.pid,
          house: Houses.NONE,
          role: Roles.INITIATE,
        };

        this.setState({ credentials, validVerification: true });
      })
      .catch(error => console.error(error.message));
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

    API.claimAccount(this.state.credentials, this.props.location.query.id,
      this.props.location.query.token, this.props.params.userID)
      .then(() => Auth.authenticateUser(this.state.credentials.email,
        this.state.credentials.password))
      .then((user) => {
        this.props.onAuthChange(user);
        browserHistory.push('/');
      })
      .catch(error => console.error(error));
  }

  render() {
    return (
      <FlexContainer>
        <FlexItem className="equal-width">
          <p>
            To claim your PID, you need to provide your name so that we can identify you and a
            password so that you can login and check your initiation or membership status.
          </p>
        </FlexItem>
        { this.state.validVerification ? (
          <FlexItem className="equal-width horizontal-padding">
            <RegistrationForm
              credentials={this.state.credentials}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              errors={this.state.errors}
              disabledFields={new Set(['email', 'pid'])}
              submitButtonText="Register"
            />
          </FlexItem>
          ) : (
            <FlexItem className="equal-width horizontal-padding">
              <form onSubmit={this.handleSubmit}>
                <p>
                  This verification link is not valid – the link may have expired if the email was
                  sent longer than a few days ago. You can resend the verification email below.
                </p>

                <label htmlFor="resendToEmail">Email
                  <input
                    name="resendToEmail"
                    type="text"
                    value={this.state.credentials.email}
                    onChange={this.handleChange}
                    placeholder="user@email.com"
                  />
                </label>

                <input type="submit" value="Resend Verification Email" />
              </form>
            </FlexItem>
          )
        }
      </FlexContainer>
    );
  }
}

VerifyAccountContainer.propTypes = {
  location: React.PropTypes.shape({
    query: React.PropTypes.shape({
      id: React.PropTypes.string,
      token: React.PropTypes.string,
    }),
  }),

  params: React.PropTypes.shape({
    userID: React.PropTypes.string,
  }),

  onAuthChange: React.PropTypes.func,
};

export default VerifyAccountContainer;
