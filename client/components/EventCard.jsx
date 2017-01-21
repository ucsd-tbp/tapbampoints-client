import React from 'react';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

const EventCard = props => (
  <FlexContainer className="EventCard academic-event-type">
    <FlexItem className="event-summary">
      <h3>{props.summary}</h3>
      <p>Date</p>
      <p>Location</p>
    </FlexItem>
    <FlexItem className="event-information">
      <p>
        This is a short description of the event. This description is added to see what happens when
        the description gets really, really, long. Potatoes.
      </p>
    </FlexItem>
    <FlexItem className="event-form">

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

    </FlexItem>
  </FlexContainer>
);

EventCard.propTypes = {
  summary: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSubmit: React.PropTypes.func,
};

export default EventCard;
