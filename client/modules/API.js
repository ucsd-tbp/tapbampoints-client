import { format } from 'date-fns';
import { isEmpty } from 'lodash';

import Auth from './Auth';
import { EPOCH_ISO_DATETIME, ventTypes } from './constants';
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

  /**
   * Retrieves a list of all announcements.
   * @return {Promise<Collection>} Promise that resolves to an array of all
   * announcements.
   */
  static retrieveAnnouncements() {
    const requestURL = `${process.env.API_ROOT}/announcements`;
    return fetch(requestURL).then(this.checkStatus);
  }

  /**
   * Retrieves an event given its ID.
   *
   * @param {number} eventID ID of event to look up.
   * @return {Promise<Event>} Promise that resolves to retrieved event.
   */
  static retrieveEvent(eventID) {
    // TODO Embed based on an optional `options` param.
    const requestURL = `${process.env.API_ROOT}/events/${eventID}?embed=attendees,type`;
    return fetch(requestURL).then(this.checkStatus).then(event => Events.formatForClient(event));
  }

  /**
   * Creates a user account with only an email and PID, and marks account as
   * unverified. Typically done when an event attendee doesn't yet have an
   * account (i.e. when going to a TBP event for the first time).
   */
  static registerUser(user, verified = false) {
    const request = new Request(`${process.env.API_ROOT}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    return fetch(request)
      .then(this.checkStatus)
      .then((response) => {
        localStorage.setItem('token', response.token)
      });
  }

  /**
   * Retrieves a user given a unique identifier.
   *
   * @param {number|string} identifier Unique ID to look up user with, usually
   * the PID or user ID.
   * @return {User} Promise resolving to found user.
   */
  static retrieveUser(value, identifier = 'pid') {
    const requestURL = `${process.env.API_ROOT}/users?${identifier}=${value}`;

    return fetch(requestURL)
      .then(this.checkStatus)
      .then((users) => {
        // If the resulting array is empty, then the user wasn't found.
        if (isEmpty(users)) {
          throw new Error(`User could not be found!`);
        }

        // Otherwise, the user is the only element in the array since the
        // identifier is enforced to be unique.
        return users[0];
      })
  }

  /**
   * Adds an attendee to an event.
   *
   * @param {number} userID ID of user to add as attendee.
   * @param {number} eventID ID of event to mark that user attended.
   * @param {number} points Number of points to assign.
   */
  static registerAttendeeForEvent(userID, eventID, points) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Auth.getToken()}`,
    };

    const request = new Request(`${process.env.API_ROOT}/users/${userID}/events/${eventID}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ points_earned: points }),
    });

    return fetch(request).then(this.checkStatus);
  }

  /**
   * Given a user's PID, gets number of events that the user attended for each
   * category and the current number of points for each category. Date ranges
   * are optional, and defaults to getting all the points that the user has
   * ever received.
   *
   * @param {string} pid PID of user to find points info for.
   * @param {Date} lowerDateBound Lower bound on date range.
   * @param {Date} upperDateBound Upper bound on dage range.
   */
  static retrievePointsInfo(pid, lowerDateBound = EPOCH_ISO_DATETIME, upperDateBound = new Date().toISOString()) {
    const requestURL = `${process.env.API_ROOT}/records/points?pid=${pid}&timeMin=${lowerDateBound}&timeMax=${upperDateBound}`;
    return fetch(requestURL).then(this.checkStatus);
  }
}

export default API;
