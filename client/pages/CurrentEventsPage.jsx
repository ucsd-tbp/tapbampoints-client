import React from 'react';

import CurrentEventsContainer from '../containers/CurrentEventsContainer';

const CurrentEventsPage = () => (
  <div className="CurrentEventsPage">
    <h3>Current Events</h3>
    <p>
      Below is a list of current events. Choose one of the events below to start sign-ups for a
      certain event.
    </p>

    <CurrentEventsContainer />
  </div>
);

export default CurrentEventsPage;
