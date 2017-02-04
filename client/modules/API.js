import { format } from 'date-fns';

import { EventTypes } from './constants';
import Events from './Events';

/** Utility functions related to API calls. */
class API {
  /**
   * Custom response handler for the `fetch` promise to reject on HTTP error
   * statuses such as 40x and 50x, since `fetch` only rejects the promise if a
   * network error has occurred
   *
   * @param {Object} response Response object.
   * @return {Promise} If response status code is within the range 200-299
   * inclusive, then returns a fulfilled Promise that resolves to the response
   * body.
   */
  static checkStatus(response) {
    if (response.ok) {
      return response.json();
    } else {
      // Rejects promise with a JSON error object.
      return response.json().then(error => { throw error; });
    }
  }

  /**
   * Creates an event.
   *
   * @param {Object} event Object with event properties to create event with.
   * @param {String} token Authorization token to place in Authorization header.
   * @return {Promise} Promise that resolves to response body when completed.
   */
  static createEvent(event, token) {
    // Includes authorization header if token is present.
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Prepares POST request to create event with JWT for authentication.
    const request = new Request(`${process.env.API_ROOT}/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(Events.formatForAPI(event)),
    });

    return fetch(request).then(this.checkStatus);
  }

  /**
   * Retrieves all Google calendar events within a specified date range as an
   * array. Only the necessary properties from the JSON response are included.
   *
   * @param {Date} lowerDateBound Lower bound on date range.
   * @param {Date} upperDateBound Upper bound on dage range.
   * @return List of Google calendar events.
   */
  static retrieveGoogleCalendarEventsBetween(lowerDateBound, upperDateBound) {
    // Constructs request URL with query parameters for date range bounds.
    const requestURL = process.env.CALENDAR_API_ROOT +
      '&timeMin=' + lowerDateBound.toISOString() +
      '&timeMax=' + upperDateBound.toISOString();

    // Gets Google calendar events within the specified time range.
    return fetch(requestURL)
      .then(this.checkStatus)
      .then((response) => response.items.map(Events.cleanGoogleCalendarEvent));
  }

  /** Retrieves a list of all events. */
  static retrieveEventsBetween(lowerDateBound, upperDateBound) {
    // Minimum is based on end time and maximum on start time to copy the
    // behavior of the timeMin and timeMax query parameters in the Google
    // Calendar v3 API.
    const requestURL = process.env.API_ROOT + '/events?embed=type' +
      '&endMin=' + lowerDateBound.toISOString() +
      '&startMax=' + upperDateBound.toISOString();

    // TODO Fetch events according to date range.
    return fetch(requestURL)
      .then(this.checkStatus)
      .then(response => response.map(Events.formatForClient));
  }

  /** Retrieves a list of all announcements. */
  static retrieveAnnouncements() {
    const requestURL = `${process.env.API_ROOT}/announcements`;
    return fetch(requestURL).then(this.checkStatus);
  }
}

export default API;
