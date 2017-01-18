import React from 'react';

import TwoColumnSplit from '../layouts/TwoColumnSplit';

import LoginFormContainer from '../containers/LoginFormContainer';
import RegistrationFormContainer from '../containers/RegistrationFormContainer';

const AuthenticationPage = props => (
  <TwoColumnSplit>
    <LoginFormContainer onAuthChange={props.onAuthChange} />
    <RegistrationFormContainer onAuthChange={props.onAuthChange} />
  </TwoColumnSplit>
);

AuthenticationPage.propTypes = {
  onAuthChange: React.PropTypes.func,
};

export default AuthenticationPage;
