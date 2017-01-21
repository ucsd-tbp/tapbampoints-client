import React from 'react';
import 'whatwg-fetch';

import addMonths from 'date-fns/add_months';
import subWeeks from 'date-fns/sub_weeks';

import EventCard from '../components/EventCard';

import API from '../modules/API';

class GoogleCalendarEventsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      googleCalendarEvents: [],
    };
  }

  componentDidMount() {
    const lowerBound = subWeeks(new Date(), 1);
    const upperBound = addMonths(new Date(), 1);

    // Constructs URL to make GET request to using the date range.
    const dateBounds = `timeMin=${lowerBound.toISOString()}&timeMax=${upperBound.toISOString()}`;
    const requestURL = `${process.env.CALENDAR_API_ROOT}&${dateBounds}`;

    fetch(requestURL)
      .then(API.checkStatus)
      .then((response) => {
        this.setState({ googleCalendarEvents: response.items });
      })
      .catch(error => console.error(error));
  }

  handleChange(event) {
    console.log(event.target.value);
  }

  render() {
    const googleCalendarEvents = this.state.googleCalendarEvents.map(event =>
      <EventCard
        key={event.id}
        summary={event.summary}
        onChange={this.handleChange}
        onSubmit={() => console.log('submitted event')}
      />
    );

    return (
      <div>
        <p>
          Below are events taken from the public Tau Beta Pi events Google calendar. These events
          typically already have the name, location, start and end times, and date already filled
          in, but in order to start signing in members, each event needs to know its type (either
          <span className="academic-highlight">&nbsp;academic/professional</span>,
          <span className="social-highlight">&nbsp;social</span>, or
          <span className="service-highlight">&nbsp;outreach/service</span>
          ), and how many points maximum it's
          worth. You can fill in those fields below.
        </p>

        {googleCalendarEvents}
      </div>
    );
  }
}

export default GoogleCalendarEventsContainer;
