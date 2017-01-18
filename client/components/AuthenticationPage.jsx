import React from 'react';

import TwoColumnSplit from '../layouts/TwoColumnSplit';

import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

const AuthenticationPage = props => (
  <TwoColumnSplit>
    <LoginForm {...props} />
    <RegistrationForm {...props} />
  </TwoColumnSplit>
);

export default AuthenticationPage;
