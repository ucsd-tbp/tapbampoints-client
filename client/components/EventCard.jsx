import React from 'react';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

const EventCard = (props) => {
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
        <p><span className="understated">Date </span>January 1, 2017</p>
        <p><span className="understated">Location </span>Henry Booker Room</p>
      </FlexItem>

      <FlexItem className="event-information">
        <p>
          <span className="understated">Description </span>This is a short description of the event. This description is added
          to see what happens when the description gets really, really, long.
          Potatoes.
        </p>
      </FlexItem>

      <FlexItem className="event-actions">

        {incompleteEventForm}

      </FlexItem>
    </FlexContainer>
  );
};

EventCard.propTypes = {
  summary: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
};

export default EventCard;
