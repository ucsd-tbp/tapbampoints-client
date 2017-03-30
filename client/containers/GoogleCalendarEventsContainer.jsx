import React from 'react';
import 'whatwg-fetch';
import { keyBy, map, merge, toNumber, values } from 'lodash';
import { addMonths, subWeeks } from 'date-fns';

import API from '../modules/API';
import Auth from '../modules/Auth';
import Events from '../modules/Events';
import { ORDERED_MONTHS } from '../modules/constants';

import CategorizedEventList from '../components/CategorizedEventList';

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
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      eventsByID: {},
    };
  }

  /**
   * After loading this container component, a request is made to get all the
   * Google calendar events within a date range. Sets the retrieved events as
   * state for all child components.
   */
  componentDidMount() {
    // Constructs URL with a date range to make GET request with.
    const lowerDateBound = subWeeks(new Date(), 1);
    const upperDateBound = addMonths(new Date(), 1);

    // Retrieves both the Google calendar events and all API events.
    API.retrieveGoogleCalendarEventsBetween(lowerDateBound, upperDateBound)
      .then(googleCalendarEvents => Promise.all([
        googleCalendarEvents,
        API.retrieveEventsBetween(lowerDateBound, upperDateBound),
      ]))
      .then(([googleCalendarEvents, apiEvents]) => {
        let filteredEvents = Events.removeRepeatedEvents(googleCalendarEvents, apiEvents);

        filteredEvents = map(filteredEvents, (event) => {
          const updated = event;
          updated.points = Events.calculatePoints(event.start, event.end);
          return updated;
        });

        this.setState({ eventsByID: keyBy(filteredEvents, 'id') });
      })
      .catch(error => console.error(error));
  }

  handleChange(googleCalendarID, event) {
    // <input type="number"> fields are hard to validate. (see
    // https://github.com/facebook/react/issues/1549). If the points input
    // changes, then converts the string value to a number before storing in
    // state. `toNumber` is used instead of the built-in `parseInt` so that an
    // empty string returns 0.
    const value = event.target.name === 'points'
      ? toNumber(event.target.value) : event.target.value;

    // Recursively merges event objects and assigns to state since React
    // doesn't automatically merge state recursively.
    const eventDiff = { [googleCalendarID]: { [event.target.name]: value } };
    this.setState({ eventsByID: merge(this.state.eventsByID, eventDiff) });
  }

  handleSubmit(googleCalendarID, event) {
    event.preventDefault();

    const eventsByID = this.state.eventsByID;
    const submittedEvent = eventsByID[googleCalendarID];

    // Creates event from Google calendar event.
    API.createEvent(submittedEvent, Auth.getToken())
      .then(() => {
        // Removes newly created event from rendered list.
        delete eventsByID[googleCalendarID];
        this.setState({ eventsByID });
      })
      .catch(error => console.error(error.error));
  }

  render() {
    return (
      <CategorizedEventList
        // BUG Object.values doesn't work in Safari, have to use Lodash. (??)
        events={values(this.state.eventsByID)}
        groupingFunc={event => event.start.getMonth()}
        categoryOrder={ORDERED_MONTHS}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        shouldDisplayForm
      />
    );
  }
}

export default GoogleCalendarEventsContainer;
