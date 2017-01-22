import { format, isEqual } from 'date-fns';
import { filter, keyBy, omit } from 'lodash';
import { DATABASE_DATE_FORMAT } from './constants';

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

  /**
   * The Event model is represented in the API in almost the same way as events
   * are represented in this front-end client, except dates are converted to
   * Date objects for flexibility and type_id renamed to eventType for
   * consistency.
   *
   * `convertAPIEvent` converts the Event model (as JSON) to another object,
   * except with the fields above changed to the client representation of
   * events.
   *
   * @param {Object} apiEvent Event object directly from API.
   * @return {Object} Client representation of event object.
   */
  static convertAPIEvent(apiEvent) {
    const convertedEvent = omit(apiEvent, ['start', 'end', 'type_id']);

    convertedEvent.startDateTime = new Date(apiEvent.start);
    convertedEvent.endDateTime = new Date(apiEvent.end);
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
  static convertClientEvent(clientEvent) {
    const convertedEvent = omit(clientEvent, ['id', 'startDateTime', 'endDateTime', 'eventType']);

    convertedEvent.start = format(clientEvent.startDateTime, DATABASE_DATE_FORMAT);
    convertedEvent.end = format(clientEvent.endDateTime, DATABASE_DATE_FORMAT);
    convertedEvent.type_id = clientEvent.eventType;

    return convertedEvent;
  }
}

export default Events;
