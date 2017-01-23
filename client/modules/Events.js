// @flow

import { format, isEqual } from 'date-fns';
import { filter, keyBy, omit } from 'lodash';
import { EventTypes, DATABASE_DATE_FORMAT } from './constants';

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
  type_id: number,
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
  eventType: number,
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
   * Date objects for flexibility and type_id renamed to eventType for
   * consistency.
   *
   * `formatForClient` converts the Event model (as JSON) to another object,
   * except with the fields above changed to the client representation of
   * events.
   *
   * @param {Object} apiEvent Event object directly from API.
   * @return {Object} Client representation of event object.
   */
  static formatForClient(apiEvent : APIEvent) : ClientEvent {
    const convertedEvent = omit(apiEvent, ['start', 'end', 'type_id']);

    convertedEvent.start = new Date(apiEvent.start);
    convertedEvent.end = new Date(apiEvent.end);
    convertedEvent.eventType = apiEvent.type_id;

    return convertedEvent;
  }

  /**
   * The reverse of the transformation detailed in the function above.
   *
   * @param {Object} clientEvent Event object according to client.
   * @return {Object} Event object corresponding to how events are represented
   * in the API.
   */
  static formatForAPI(clientEvent : ClientEvent) : APIEvent {
    const convertedEvent = omit(clientEvent, ['id', 'start', 'end', 'eventType']);

    convertedEvent.start = format(clientEvent.start, DATABASE_DATE_FORMAT);
    convertedEvent.end = format(clientEvent.end, DATABASE_DATE_FORMAT);
    convertedEvent.type_id = clientEvent.eventType;

    return convertedEvent;
  }

      // Converts array of JSON events return by the Google Calendar API to a
      // neater, flatter version with only the required properties.

  static cleanGoogleCalendarEvent(googleCalendarEvent) : ClientEvent {
    // Extracts only the necessary info from the JSON response returned
    // by the Google Calendar API.
    return {
      id: googleCalendarEvent.id,
      summary: googleCalendarEvent.summary,
      description: googleCalendarEvent.description,
      location: googleCalendarEvent.location,
      start: new Date(googleCalendarEvent.start.dateTime),
      end: new Date(googleCalendarEvent.end.dateTime),
      points: 0,
      eventType: EventTypes.WILDCARD,
    };
  }
}

export default Events;
