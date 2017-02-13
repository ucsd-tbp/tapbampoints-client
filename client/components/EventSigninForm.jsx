import React from 'react';

import FlexItem from '../layouts/FlexItem';
import ChangeSigninModeButton from './ChangeSigninModeButton';

import { EventSigninSteps } from '../modules/constants';

const EventSigninForm = (props) => {
    // First step to sign into an event. Attendee should either slide their ID
    // card or manually input their PID.
  const identificationForm = (
    <FlexItem>
      <h3>Slide your ID card, or type your PID in the box below.</h3>

      {/* Form containing a single input field for the PID. */}
      <form className="step-presentation" onSubmit={props.onSubmit}>
        <label htmlFor="pid">PID
          <input
            name="pid"
            type="password"
            value={props.identification.pid}
            onChange={props.onChange}
            placeholder="A12345678"
            autoFocus
          />
        </label>
        <input type="submit" value="Continue" />
      </form>
    </FlexItem>
  );

  // This step is only required if the attendee's PID could not be found. In
  // this case, this is the attendee's first time going to an event.
  const emailForm = (
    <FlexItem>
      <h3>
        We can't find your pid! Put in your email below so that we
        can email you instructions on setting up an account.
      </h3>

      {/* Form containing a single input field for the email. */}
      <form className="step-presentation" onSubmit={props.onSubmit}>
        <label htmlFor="email">Email
          <input
            name="email"
            type="text"
            value={props.identification.email}
            onChange={props.onChange}
            placeholder="user@email.com"
            autoFocus
          />
        </label>
        <input type="submit" value="Finish" />
      </form>
    </FlexItem>
  );

  // Indicates that the attendee is done with the form.
  const completeStep = (
    <FlexItem>
      <h3>Congrats, you're done!</h3>
      <button type="submit" onClick={props.onSubmit} autoFocus>Start Over</button>
    </FlexItem>
  );

  // Determines which form to render.
  let currentStep;
  switch (props.step) {

    // Renders first step for the PID.
    case EventSigninSteps.IDENTIFICATION:
      currentStep = identificationForm;
      break;

    // Renders second step for the email.
    case EventSigninSteps.NOT_YET_REGISTERED:
      currentStep = emailForm;
      break;

    // Renders final completion page.
    case EventSigninSteps.COMPLETE:
      currentStep = completeStep;
      break;

    default:
      currentStep = <h3>Something went wrong! Refresh the page.</h3>;
  }

  return (
    <FlexItem className="EventSigninForm">
      <h1><span className="light-emphasis">Signing-in for: </span>{props.event.summary}</h1>
      {currentStep}
      <ChangeSigninModeButton mode={this.state.mode} onClick={props.onModeChange} />
    </FlexItem>
  );
};

EventSigninForm.propTypes = {
  event: React.PropTypes.shape({
    summary: React.PropTypes.string,
  }).isRequired,

  identification: React.PropTypes.shape({
    pid: React.PropTypes.string,
    email: React.PropTypes.string,
  }).isRequired,

  step: React.PropTypes.oneOf([
    EventSigninSteps.IDENTIFICATION, EventSigninSteps.NOT_YET_REGISTERED, EventSigninSteps.COMPLETE,
  ]).isRequired,

  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onModeChange: React.PropTypes.func.isRequired,
};

export default EventSigninForm;
