/**
 * @file Project-wide constants, each with an additional description. Constants
 *int CapitalizedCamelCase are used as enums.
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
  COMPLETE: 'complete',
});

// Different behaviors for signing-in at events.
export const EventSigninModes = Object.freeze({
  SIGNIN_ONCE: 'sign-in once',
  SIGNOUT_ONLY: 'sign-out only',
  SIGNIN_AND_SIGNOUT: 'sign-in and sign-out',
});

// Length of PID, including starting letter.
export const PID_LENGTH = 9;

// Max number of points an event can give.
export const MAX_POINTS_VALUE = 3;
