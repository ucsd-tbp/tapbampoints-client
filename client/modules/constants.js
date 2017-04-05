/**
 * @file Project-wide constants, each with an additional description. Constants
 * in CapitalizedCamelCase are used as enums.
 */

// Maps an event type to the primary key of that event type as stored in the
// database, and is used when POSTing to the /events endpoint when creating or
// updating an event. The integer constants that each are mapped to are
// important, since they must match the primary key as stored in the API.
export const EventTypes = Object.freeze({
  ACADEMIC: 'academic',
  SOCIAL: 'social',
  SERVICE: 'service',
  WILDCARD: 'wildcard',
});

export const Houses = Object.freeze({
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  NONE: 'none',
});

// List of months in order. Used when grouping elements by month.
export const ORDERED_MONTHS = Object.freeze([
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]);

// MySQL date format for date/time objects.
export const DATABASE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// User roles, used for showing restricted routes.
export const Roles = Object.freeze({
  INITIATE: 'initiate',
  PENDING_MEMBER: 'pending',
  INACTIVE_MEMBER: 'inactive',
  MEMBER: 'member',
  OFFICER: 'officer',
  ADMIN: 'admin',
});

// Maps an event type to the appropriate class name.
// See ../static/stylesheets/components/_EventCard.scss.
export const CLASSNAME_TYPES = Object.freeze({
  [EventTypes.ACADEMIC]: 'academic-event-type',
  [EventTypes.SOCIAL]: 'social-event-type',
  [EventTypes.SERVICE]: 'service-event-type',
  [EventTypes.WILDCARD]: 'wildcard-event-type',
});

// Steps for signing into an event.
export const EventSigninSteps = Object.freeze({
  IDENTIFICATION: 'identification',
  NOT_YET_REGISTERED: 'not yet registered',
  POINT_SELECTION: 'points input',
  COMPLETE: 'complete',
});

// Length of PID, including starting letter.
export const PID_LENGTH = 9;

// Validates email input fields.
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const MIN_PASSWORD_LENGTH = 6;

// For consistent scrolling animations across the app.
export const SCROLL_ANIMATION_CONFIG = Object.freeze({
  smooth: 'easeOutQuad',
  duration: 300,
});

// Datetime string for the beginning of time (practically) in ISO format.
export const EPOCH_ISO_DATETIME = '1970-01-01T00:00:00.000Z';
