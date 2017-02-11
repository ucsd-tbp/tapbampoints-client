import React from 'react';
import { toInteger } from 'lodash';

import EventSigninFormContainer from '../containers/EventSigninFormContainer';

// Passes the eventID in the URL to render the event sign-in form.
const EventSigninPage = props =>
  <EventSigninFormContainer eventID={toInteger(props.params.eventID)} />;

EventSigninPage.propTypes = {
  // Contains eventID URL parameter.
  params: React.PropTypes.objectOf(React.PropTypes.string),
};

export default EventSigninPage;
