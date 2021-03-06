// @flow

import { format, isEqual, isValid, differenceInMinutes } from 'date-fns';
import { clone, filter, keyBy, reduce } from 'lodash';
import { DATABASE_DATE_FORMAT, EventTypes, PID_LENGTH } from './constants';

/**
 * Shape of an event object used when creating or updating events from the API.
 * Properties are in snake case according to the MySQL convention.
 * @type {APIEvent}
 */
export type APIEvent = {
  id: string,
  summary: string,
  description: string,
  location: string,
  start: string,
  end: string,
  type: Object,
};

/**
 * Shape of an event object used in the client. Start and end dates are `Date`
 * objects instead of strings for easier manipulation and less calls to
 * `new Date()`.
 * @type {ClientEvent}
 */
export type ClientEvent = {
  id: number,
  summary: string,
  description: string,
  location: string,
  start: Date,
  end: Date,
  type: string,
};

/**
 * Utility functions related to manipulating different types of events (Google
 * Calendar events, client events, and JSON from the API's event model.)
 */
class Events {
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
  static removeRepeatedEvents(googleCalendarEvents, apiEvents : APIEvent[]) {
    // Maps summaries to API events for faster lookup.
    const apiEventsBySummary = keyBy(apiEvents, 'summary');

    return filter(googleCalendarEvents, (googleCalendarEvent) => {
      const apiEvent = apiEventsBySummary[googleCalendarEvent.summary];
      if (!apiEvent) return true;

      return apiEvent.summary === googleCalendarEvent.summary
        && apiEvent.location === googleCalendarEvent.location
        && isEqual(new Date(apiEvent.start), googleCalendarEvent.start.dateTime)
        && isEqual(new Date(apiEvent.end), googleCalendarEvent.end.dateTime);
    });
  }

  /**
   * The Event model is represented in the API in almost the same way as events
   * are represented in this front-end client, except dates are converted to
   * Date objects for flexibility.
   *
   * `formatForClient` converts the Event model (as JSON) to another object,
   * except with the fields above changed to the client representation of
   * events.
   *
   * @param {Object} apiEvent Event object directly from API.
   * @return {Object} Client representation of event object.
   */
  static formatForClient(apiEvent : APIEvent) : ClientEvent {
    const clientEvent = clone(apiEvent);

    clientEvent.start = new Date(apiEvent.start);
    clientEvent.end = new Date(apiEvent.end);
    clientEvent.type = apiEvent.type.name;

    return clientEvent;
  }

  /**
   * The reverse of the transformation detailed in the function above.
   *
   * @param {Object} clientEvent Event object according to client.
   * @return {Object} Event object corresponding to how events are represented
   * in the API.
   */
  static formatForAPI(clientEvent : ClientEvent) : APIEvent {
    const apiEvent = clone(clientEvent);

    apiEvent.start = format(clientEvent.start, DATABASE_DATE_FORMAT);
    apiEvent.end = format(clientEvent.end, DATABASE_DATE_FORMAT);

    delete apiEvent.id;

    return apiEvent;
  }

  /**
   * Converts JSON object representing an event returned by the Google Calendar
   * API to a flatter version with only the required properties.
   *
   * @param {Object} googleCalendarEvent Event to clean.
   * @return {ClientEvent} Event with properties filtered from Google calendar
   * event.
   */
  static cleanGoogleCalendarEvent(googleCalendarEvent) : ClientEvent {
    return {
      id: googleCalendarEvent.id,
      summary: googleCalendarEvent.summary,
      description: googleCalendarEvent.description,
      location: googleCalendarEvent.location,
      start: new Date(googleCalendarEvent.start.dateTime),
      end: new Date(googleCalendarEvent.end.dateTime),
      points: 0,
      type: EventTypes.WILDCARD,
    };
  }

  /** Extracts the PID from data given by the magnetic stripe card reader. */
  static parsePID(input) {
    // If manually entered PID, then don't try to parse.
    if (input.length === PID_LENGTH) return input;

    // If given input is less than minimum PID length, indicate error.
    if (input.length < PID_LENGTH) return '';

    // TODO Undergrad PIDs start with 'A'. What about extension/grad students?
    const prefix = input.substring(1, 3) === '09' ? 'A' : 'U';
    const pidNumber = input.substring(3, 11);

    return prefix + pidNumber;
  }

  /**
   * Converts a date range specified by two `Date` objects to a
   * human-readable string.

   * @param  {Date} lowerDateBound Lower bound of date range.
   * @param  {Date} upperDateBound Upper bound of date range.
   * @return {String} Date range as a human-readable string.
   */
  static formatDateRange(lowerDateBound, upperDateBound) {
    return !isValid(lowerDateBound) || !isValid(upperDateBound) ? 'No date or time provided'
      : `${format(lowerDateBound, 'MMMM Do, YYYY h:mm A')} to ${format(upperDateBound, 'h:mm A')}`;
  }

  /**
   * Calculates points given a time interval.
   *
   * When dealing with a portion of an hour, the elapsed minutes value is
   * rounded up to the higher 30-minute interval, and points are calculated
   * based on this rounded minute value, where 60 minutes = 1 points. Since
   * partial hours are rounded to 30-minute intervals, the points value can
   * only be a multiple of 0.5.
   *
   * @example An attendee staying at an event for 125 minutes (a bit over two
   * hours) is the same as 120 + 5 minutes. 5 minutes is rounded up to 30, so
   * the attendee gets 120 + 30 = 150 minutes, which is 2.5 points.
   *
   * @param {Date} intervalStart Start of time interval.
   * @param {Date} intervalEnd End of time interval.
   *
   * @return {number} Points value calculated from time interval.
   */
  static calculatePoints(intervalStart, intervalEnd) {
    const rawMinutesDifference = differenceInMinutes(intervalEnd, intervalStart);

    const minutesRemainder = rawMinutesDifference % 60;
    const hourIntervalsInMinutes = rawMinutesDifference - minutesRemainder;

    // Rounds up to higher 30-minute interval.
    const roundedMinutes = minutesRemainder + (30 - (minutesRemainder % 30));

    // Gives half a point per half hour.
    return (minutesRemainder !== 0 ? roundedMinutes : 0 + hourIntervalsInMinutes) / 60.0;
  }

  /**
   * Given a pointsInfo object retrieved via retrievePointsInfo(), determines
   * whether the user is eligible for initiation (if an initiate) or if the
   * user will remain an active member (if a member).
   *
   * @param {Object} pointsInfo info object retrieved from /records/points
   * @param {boolean} isMember whether to calculate point requirements based on
   * member requirements or initiate requirements
   *
   * @return {boolean} true if the user is eligible for initiation (if an
   * initiate) or if the user will remain an active member (if a member).
   */
  static meetsPointRequirements(pointsInfo, isMember = false) {
    const totalPoints = reduce(pointsInfo, (sum, type) => sum + type.total, 0);
    if (isMember && totalPoints > 8) return true;

    let numWildcardPoints = pointsInfo.wildcard.total;

    const pointsTuple = [
      pointsInfo.academic.total,
      pointsInfo.social.total,
      pointsInfo.service.total,
    ];

    // Distributes wildcard points to try to satisfy the minimum requirements
    // for each point category.
    pointsTuple.forEach((typeTotal) => {
      const gap = Math.abs(3 - typeTotal);

      if (gap > 0 && numWildcardPoints - gap >= 0) {
        numWildcardPoints -= gap;
      } else if (numWildcardPoints - gap < 0) {
        // There aren't enough wildcard points to reach the 3 reqiured points
        // for some point category, so the initiate isn't eligible.
        return false;
      }
    });

    // At least have 9 points because the requirements for 3 points in each of
    // the 3 categories are satisifed; checks that the remaining number of
    // wildcard points meets the minimum number of total points (15).
    return numWildcardPoints + 9 >= 15;
  }
}

export default Events;
