import React from 'react';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

import LoginFormContainer from '../containers/LoginFormContainer';
import RegistrationFormContainer from '../containers/RegistrationFormContainer';

const AuthenticationPage = props => (
  // TODO Pass location props for redirecting after successful login.
  <FlexContainer>
    <FlexItem><LoginFormContainer onAuthChange={props.onAuthChange} /></FlexItem>
    <FlexItem><RegistrationFormContainer onAuthChange={props.onAuthChange} /></FlexItem>
  </FlexContainer>
);

AuthenticationPage.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default AuthenticationPage;
