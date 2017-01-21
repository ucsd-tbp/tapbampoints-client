import React from 'react';
import 'whatwg-fetch';

import addMonths from 'date-fns/add_months';
import subWeeks from 'date-fns/sub_weeks';

import EventCard from '../components/EventCard';

import API from '../modules/API';

/**
 * Creates a list of "suggested events", or a list of events taken from the
 * public Google calendar.
 *
 * These events need their maximum point values and event types confirmed
 * before being displayed to members as available to sign up for, since the
 * Google Calendar event creation form doesn't let us add any additional fields
 * like a point value.
 */
class GoogleCalendarEventsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      mappedEvents: {},
    };
  }

  /**
   * After loading this container component, a request is made to get all the
   * Google calendar events within a date range. Sets the retrieved events as
   * state for all child components.
   */
  componentDidMount() {
    // Constructs URL with a date range to make GET request with.
    const lowerDate = subWeeks(new Date(), 1).toISOString();
    const upperDate = addMonths(new Date(), 1).toISOString();
    const requestURL = `${process.env.CALENDAR_API_ROOT}&timeMin=${lowerDate}&timeMax=${upperDate}`;

    // Gets Google calendar events within the specified time range.
    fetch(requestURL)
      .then(API.checkStatus)
      .then((response) => {
        // Creates a map of an event ID to its event in order to easily look up
        // and delete a given event from the list of suggested events.
        const mappedEvents = response.items.reduce((events, currentEvent) => {
          const modifiedEvents = events;

          // Extracts only the necessary info from the JSON response returned
          // by the Google Calendar API.
          const cleanedEvent = {
            summary: currentEvent.summary,
            description: currentEvent.description,
            location: currentEvent.location,
            startDateTime: new Date(currentEvent.start.dateTime),
            endDateTime: new Date(currentEvent.end.dateTime),
          };

          modifiedEvents[currentEvent.id] = cleanedEvent;
          return modifiedEvents;
        }, {});

        this.setState({ mappedEvents });
      })
      .catch(error => console.error(error));
  }

  handleChange(event) {
    console.log(event.target.value);
  }

  handleSubmit(event) {
    console.log('submitted event');
  }

  render() {
    return (
      <div><p>Potatoes!</p></div>
    );
  }
}

export default GoogleCalendarEventsContainer;
