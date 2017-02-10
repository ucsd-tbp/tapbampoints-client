import React from 'react';
import { toInteger } from 'lodash';

import EventSigninFormContainer from '../containers/EventSigninFormContainer';

// Passes the eventID in the URL to render the event sign-in form.
const EventRegistrationPage = props =>
  <EventSigninFormContainer eventID={toInteger(props.params.eventID)} />;

EventRegistrationPage.propTypes = {
  // Contains eventID URL parameter.
  params: React.PropTypes.objectOf(React.PropTypes.string),
};

export default EventRegistrationPage;
