import React from 'react';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

import LoginFormContainer from '../containers/LoginFormContainer';
import RegistrationFormContainer from '../containers/RegistrationFormContainer';

const AuthenticationPage = props => (
  // TODO Pass location props for redirecting after successful login.
  <FlexContainer>
    <FlexItem className="equal-width horizontal-padding">
        <h3>Login</h3>
        <p>Stay logged in to sign up to events and to keep track of your
        quarterly points.</p>

      <LoginFormContainer onAuthChange={props.onAuthChange} />
    </FlexItem>

    <FlexItem className="equal-width horizontal-padding">
      <h3>Register</h3>
      <p>
        If you've been to an event, you'll need to make an account to register
        the the PID with your name and email so that we can keep track of your
        points.
      </p>

      <RegistrationFormContainer onAuthChange={props.onAuthChange} />
    </FlexItem>
  </FlexContainer>
);

AuthenticationPage.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default AuthenticationPage;
