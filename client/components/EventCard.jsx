import React from 'react';
import { format, isValid } from 'date-fns';
import { truncate } from 'lodash';
import classnames from 'classnames';
import { Link } from 'react-router';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

import Events from '../modules/Events';
import { EventTypes, CLASSNAME_TYPES } from '../modules/constants';


const EventCard = (props) => {
  const formattedDateString = Events.formatDateRange(props.event.start, props.event.end);

  let incompleteEventForm;
  let eventActions;

  // May be undefined if the event form shouldn't be displayed.
  if (props.shouldDisplayForm) {
    // Adds event ID to parameter of handler methods to distinguish between other
    // events in the list.
    const onChange = props.onChange.bind(this, props.event.id);
    const onSubmit = props.onSubmit.bind(this, props.event.id);

    // Form containing fields to fill in points and event type. All event fields
    // are required in props except for points and event type, and if these
    // fields aren't provided, then the below form appears for officers to fill
    // them in.
    incompleteEventForm = (
      <FlexItem className="equal-width">
        <form onSubmit={onSubmit}>

          <FlexContainer className="event-form-container">

            <FlexItem className="event-form-item equal-width">
              <label htmlFor="points">Points
                <input name="points" type="number" value={props.event.points} onChange={onChange} />
              </label>
            </FlexItem>

            <FlexItem className="event-form-item equal-width">
              <label htmlFor="type">Type
                <select name="type" value={props.event.type} onChange={onChange}>
                  <option value={EventTypes.ACADEMIC}>Academic</option>
                  <option value={EventTypes.SOCIAL}>House or Social</option>
                  <option value={EventTypes.SERVICE}>Community Service or Outreach</option>
                  <option value={EventTypes.WILDCARD}>Wildcard</option>
                </select>
              </label>
            </FlexItem>

            <div className="event-form-item event-create-section">
              <input type="submit" value="Create" className={CLASSNAME_TYPES[props.event.type]} />
            </div>

          </FlexContainer>

        </form>
      </FlexItem>
    );
  } else {
    // Only appears when event is complete, i.e. has points and event type
    // properties.
    eventActions = (
      <FlexItem>

        <FlexContainer className="stack">
          <FlexItem>
            <button className={CLASSNAME_TYPES[props.event.type]}>View</button>
          </FlexItem>

          { props.shouldDisplayProtectedRoutes &&
            <FlexItem>
              <button className="admin-button">
                <Link to={`/admin/events/register/${props.event.id}`}>Start Sign-ins</Link>
              </button>
            </FlexItem>
          }
        </FlexContainer>
      </FlexItem>
    );
  }

  return (
    <FlexContainer className={classnames('EventCard', CLASSNAME_TYPES[props.event.type])}>

      <FlexItem className="event-summary equal-width">
        <h3>{props.event.summary}</h3>
        <p><span className="understated">Date </span>{formattedDateString}</p>
        <p>
          <span className="understated">Location </span>
          {props.event.location || 'No location provided.'}
        </p>
      </FlexItem>

      <FlexItem className="event-information equal-width">
        <p>
          <span className="understated">Description </span>
          {truncate(props.event.description, { length: 140 }) || 'No description provided.'}
        </p>
      </FlexItem>

      { props.shouldDisplayForm ? incompleteEventForm : eventActions }

    </FlexContainer>
  );
};

EventCard.propTypes = {
  event: React.PropTypes.shape({
    // Minimum info to render event card.
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
    ]).isRequired,
    summary: React.PropTypes.string.isRequired,

    // Given placeholders if empty or invalid.
    description: React.PropTypes.string,
    location: React.PropTypes.string,
    start: React.PropTypes.instanceOf(Date),
    end: React.PropTypes.instanceOf(Date),

    // Optional since Google calendar events don't have points or types.
    points: React.PropTypes.number,
    type: React.PropTypes.oneOf(
      [EventTypes.ACADEMIC, EventTypes.SOCIAL, EventTypes.SERVICE, EventTypes.WILDCARD]
    ),
  }),

  // Optional since not all event cards have forms.
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,

  // Whether to show points/type form.
  shouldDisplayForm: React.PropTypes.bool,

  // Whether to show routes for officers/admins.
  shouldDisplayProtectedRoutes: React.PropTypes.bool,
};

export default EventCard;
