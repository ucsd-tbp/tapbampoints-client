import React from 'react';

import { EventSigninSteps } from '../modules/constants';

const ChangeSigninModeButton = props => (
  <div className="ChangeSigninModeButton" onClick={props.onClick}>
    <p className="uppercase">{props.mode}</p>
  </div>
);

ChangeSigninModeButton.propTypes = {
  mode: React.PropTypes.oneOf([
    EventSigninSteps.SIGNOUT_ONLY,
    EventSigninSteps.SIGNIN_AND_SIGNOUT,
    EventSigninSteps.SIGNIN_ONCE,
  ]).isRequired,

  onClick: React.PropTypes.func.isRequired,
};

export default ChangeSigninModeButton;
