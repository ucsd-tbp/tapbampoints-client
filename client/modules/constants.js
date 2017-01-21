/** @file Project-wide constants, each with an additional description. */

// Maps an event type to the primary key of that event type as stored in the
// database, and is used when POSTing to the /events endpoint when creating or
// updating an event. The integer constants that each are mapped to are
// important, since they must match the primary key as stored in the API.
export const EventTypes = Object.freeze({
  ACADEMIC: 1,
  SOCIAL: 2,
  SERVICE: 3,
  WILDCARD: 4,
});

// Maps an event type to the appropriate class name.
// See ../static/stylesheets/components/_EventCard.scss.
export const CLASSNAME_TYPES = Object.freeze({
  [EventTypes.ACADEMIC]: 'academic-event-type',
  [EventTypes.SOCIAL]: 'social-event-type',
  [EventTypes.SERVICE]: 'service-event-type',
  [EventTypes.WILDCARD]: 'wildcard-event-type',
});

// List of months in order. Used when grouping elements by month.
export const ORDERED_MONTHS = Object.freeze([
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]);
