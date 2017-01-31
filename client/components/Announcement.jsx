import React from 'react';
import { format } from 'date-fns';

const Announcement = props => (
  <div className="Announcement">
    <h3>{props.summary}</h3>
    <p className="understated">{format(props.updatedAt, 'MMMM Do, YYYY h:mm A')}</p>
    <p>{props.description}</p>
  </div>
);


Announcement.propTypes = {
  summary: React.PropTypes.string,
  description: React.PropTypes.string,
  updatedAt: React.PropTypes.instanceOf(Date),
};

export default Announcement;
