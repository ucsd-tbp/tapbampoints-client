import React from 'react';

/** Separates sections of events when displaying events in a list. */
const EventCategoryHeader = props => (
  <div className="EventCategoryHeader">
    <h2><span className="understated">{props.category}</span></h2>
  </div>
);

EventCategoryHeader.propTypes = {
  category: React.PropTypes.string.isRequired,
};

export default EventCategoryHeader;
