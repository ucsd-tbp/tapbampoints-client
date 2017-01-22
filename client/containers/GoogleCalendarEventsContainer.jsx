import React from 'react';
import 'whatwg-fetch';
import { filter, keyBy, merge, toNumber } from 'lodash';

import addMonths from 'date-fns/add_months';
import subWeeks from 'date-fns/sub_weeks';
import isEqual from 'date-fns/is_equal';

import API from '../modules/API';
import Auth from '../modules/Auth';
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
  /**
   * Given a list of events taken from a Google calendar, compares these events
   * with a set of events stored in the API and removes events from
   * `googleCalendarEvents` if the event has already been stored. This avoids
   * suggesting events for creation if the event has already been created.
   *
   * Two events are equal if the summary, description, location, start, and end
   * times are all equal.
   *
   * @param {Array} googleCalendarEvents List of Google calendar events.
   * @param {Array} apiEvents List of events retrieved from API.
   * @return Array of events that are in `googleCalendarEvents` but not in
   * `apiEvents` (the list of events that have already been created).
   */
  static removeRepeatedEvents(googleCalendarEvents, apiEvents) {
    // Maps summaries to API events for faster lookup.
    const apiEventsBySummary = keyBy(apiEvents, 'summary');

    return filter(googleCalendarEvents, (googleCalendarEvent) => {
      const apiEvent = apiEventsBySummary[googleCalendarEvent.summary];
      if (!apiEvent) return true;

      return apiEvent.summary === googleCalendarEvent.summary
        && apiEvent.location === googleCalendarEvent.location
        && isEqual(new Date(apiEvent.start), googleCalendarEvent.startDateTime)
        && isEqual(new Date(apiEvent.end), googleCalendarEvent.endDateTime);
    });
  }

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
      .then(googleCalendarEvents => Promise.all([googleCalendarEvents, API.retrieveEvents()]))
      .then(([googleCalendarEvents, apiEvents]) => {
        const filteredEvents =
          GoogleCalendarEventsContainer.removeRepeatedEvents(googleCalendarEvents, apiEvents);

        this.setState({ eventsByID: keyBy(filteredEvents, 'id') });
      })
      .catch(error => console.error(error));
  }

  handleChange(googleCalendarID, event) {
    // <input type="number"> fields are hard to validate. (see
    // https://github.com/facebook/react/issues/1549). If the points input
    // changing, then converts the string value to a number before storing in
    // state. `toNumber` is used instead of the built-in `parseInt` so that an
    // empty string returns 0.
    const value = event.target.name === 'points' || event.target.name === 'eventType'
      ? toNumber(event.target.value) : event.target.value;

    // Recursively merges event objects and assigns to state.
    const eventDiff = { [googleCalendarID]: { [event.target.name]: value } };
    this.setState({ eventsByID: merge(this.state.eventsByID, eventDiff) });
  }

  handleSubmit(googleCalendarID, event) {
    event.preventDefault();

    const eventsByID = this.state.eventsByID;
    const submittedEvent = eventsByID[googleCalendarID];

    // Creates event from Google calendar event.
    API.createEvent(submittedEvent, Auth.getToken())
      .then((response) => {
        // Removes newly created event from rendered list.
        delete eventsByID[googleCalendarID];
        this.setState({ eventsByID });

        console.log(response);
      })
      .catch(error => console.error(error.error));
  }

  render() {
    return (
      <CategorizedEventList
        events={Object.values(this.state.eventsByID)}
        groupingFunc={event => event.startDateTime.getMonth()}
        categoryOrder={ORDERED_MONTHS}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default GoogleCalendarEventsContainer;
