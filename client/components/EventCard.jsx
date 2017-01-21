import React from 'react';
import format from 'date-fns/format';
import isValid from 'date-fns/is_valid';
import { truncate } from 'lodash';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

import { EventTypes } from '../modules/constants';

const EventCard = (props) => {
  let formattedDateString;

  // Checks validity of date range and creates date and time string to display.
  if (!isValid(props.startDateTime) || !isValid(props.endDateTime)) {
    formattedDateString = 'No date or time provided.';
  } else {
    const startDateTime = format(props.startDateTime, 'MMMM Qo, YYYY h:mm A');
    const endTime = format(props.endDateTime, 'h:mm A');
    formattedDateString = `${startDateTime} to ${endTime}`;
  }

  // Form containing fields to fill in points and event type. All event fields
  // are required in props except for points and event type, and if these
  // fields aren't provided, then the below form appears for officers to fill
  // them in.
  const incompleteEventForm = (
    <form onSubmit={props.onSubmit}>

      <FlexContainer className="event-form-container">
        <FlexItem className="event-form-item">
          <label htmlFor="points">Points
            <input
              name="points"
              type="number"
              onChange={props.onChange}
              placeholder="0"
            />
          </label>
        </FlexItem>

        <FlexItem className="event-form-item">
          <label htmlFor="eventType">Type
            <select>
              <option value={1}>Academic</option>
            </select>
          </label>
        </FlexItem>

        <div className="event-form-item event-create-section">
          <input type="submit" value="Create" />
        </div>

      </FlexContainer>

    </form>
  );

  return (
    <FlexContainer className="EventCard academic-event-type">

      <FlexItem className="event-summary">
        <h3>{props.summary}</h3>
        <p><span className="understated">Date </span>{formattedDateString}</p>
        <p>
          <span className="understated">Location </span>
          {props.location || 'No location provided.'}
        </p>
      </FlexItem>

      <FlexItem className="event-information">
        <p>
          <span className="understated">Description </span>
          {truncate(props.description, { length: 140 }) || 'No description provided.'}
        </p>
      </FlexItem>

      <FlexItem className="event-actions">

        {incompleteEventForm}

      </FlexItem>
    </FlexContainer>
  );
};

EventCard.propTypes = {
  // Minimum info to render event card.
  summary: React.PropTypes.string.isRequired,

  // Given placeholders if empty or invalid.
  description: React.PropTypes.string,
  location: React.PropTypes.string,
  startDateTime: React.PropTypes.instanceOf(Date),
  endDateTime: React.PropTypes.instanceOf(Date),

  // Optional since Google calendar events don't have points or types.
  points: React.PropTypes.number,
  eventType: React.PropTypes.oneOf([EventTypes.ACADEMIC, EventTypes.SOCIAL, EventTypes.SERVICE]),

  // Optional since not all event cards have forms.
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
  googleCalendarID: React.PropTypes.string,
};

export default EventCard;
