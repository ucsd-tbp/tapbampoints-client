import React from 'react';

import { EventSigninSteps } from '../modules/constants';

import FlexItem from '../layouts/FlexItem';
import PointSelectionForm from './PointSelectionForm';

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

  const pointSelectionStep = (
    <FlexItem>
      <h3>Choose the number of points received at this event.</h3>

      <PointSelectionForm
        max={3}
        pointsToAssign={props.pointsToAssign}
        onChange={props.onChange}
        onSubmit={props.onSubmit}
        className="step-presentation"
      />
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

    case EventSigninSteps.IDENTIFICATION:
      currentStep = identificationForm;
      break;

    case EventSigninSteps.NOT_YET_REGISTERED:
      currentStep = emailForm;
      break;

    case EventSigninSteps.COMPLETE:
      currentStep = completeStep;
      break;

    case EventSigninSteps.POINT_SELECTION:
      currentStep = pointSelectionStep;
      break;

    default:
      currentStep = <h3>Something went wrong! Refresh the page.</h3>;
  }

  return (
    <FlexItem className="EventSigninForm">
      <h1><span className="light-emphasis">Signing-in for: </span>{props.event.summary}</h1>
      {currentStep}
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
    EventSigninSteps.IDENTIFICATION,
    EventSigninSteps.NOT_YET_REGISTERED,
    EventSigninSteps.POINT_SELECTION,
    EventSigninSteps.COMPLETE,
  ]).isRequired,

  pointsToAssign: React.PropTypes.number,

  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
};

export default EventSigninForm;
