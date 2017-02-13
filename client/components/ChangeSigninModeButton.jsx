import React from 'react';

import { EventSigninSteps, EventSigninModes } from '../modules/constants';

const ChangeSigninModeButton = props => (
  <div className="ChangeSigninModeButton" onClick={props.onClick}>
    <p className="smallcaps no-margin">{props.mode}</p>
  </div>
);

ChangeSigninModeButton.propTypes = {
  mode: React.PropTypes.oneOf([
    EventSigninModes.SIGNOUT_ONLY,
    EventSigninModes.SIGNIN_AND_SIGNOUT,
    EventSigninModes.SIGNIN_ONCE,
  ]).isRequired,

  onClick: React.PropTypes.func.isRequired,
};

export default ChangeSigninModeButton;
