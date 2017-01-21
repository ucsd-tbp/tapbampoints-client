/** @file Project-wide constants, each with an additional description. */

// Maps an event type to the primary key of that event type as stored in the
// database, and is used when POSTing to the /events endpoint when creating or
// updating an event. The integer constants that each are mapped to are
// important, since they must match the primary key as stored in the API.
export const EventTypes = Object.freeze({
  ACADEMIC: 1,
  SOCIAL: 2,
  COMMUNITY_SERVCE: 3,
});

// List of months in order.
export const ORDERED_MONTHS = Object.freeze([
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]);
