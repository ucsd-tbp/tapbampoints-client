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
    // Constructs URL to make GET request to using the date range.
    const lowerDate = subWeeks(new Date(), 1).toISOString();
    const upperDate = addMonths(new Date(), 1).toISOString();
    const requestURL = `${process.env.CALENDAR_API_ROOT}&timeMin=${lowerDate}&timeMax=${upperDate}`

    // Gets Google calendar events within the specified time range.
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
      <div>{googleCalendarEvents}</div>
    );
  }
}

export default GoogleCalendarEventsContainer;
