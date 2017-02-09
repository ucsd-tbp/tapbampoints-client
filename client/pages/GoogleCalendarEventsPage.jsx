import React from 'react';

import GoogleCalendarEventsContainer from '../containers/GoogleCalendarEventsContainer';

const GoogleCalendarEventsPage = () => (
  <div>
    <h3>Google Calendar Events</h3>

    <p>
      Below are events taken from the public Tau Beta Pi events Google calendar. These events
      typically already have the name, location, start and end times, and date already filled
      in, but in order to start signing in members, each event needs to know its type (either
      <span className="academic-color">&nbsp;academic/professional</span>,
      <span className="social-color">&nbsp;social</span>, or
      <span className="service-color">&nbsp;outreach/service</span>
      ), and how many points maximum it's
      worth. You can fill in those fields below.
    </p>

    <GoogleCalendarEventsContainer />
  </div>
);

export default GoogleCalendarEventsPage;
