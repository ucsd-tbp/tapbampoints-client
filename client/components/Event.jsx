import React from 'react';

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      points: 0,
      type: '',
    };
  }

  render() {
    // TODO Check all properties for existence with propTypes.
    const isIncomplete = !('points' in this.props) || !('type' in this.props);

    let description;
    if (this.props.description.length > 140) {
      description = `${this.props.description.substring(0, 140)}...`;
    } else {
      description = this.props.description;
    }

    // TODO Figure out a convention for CSS class naming.
    return (
      <div className="Event">
        <div className="title center">
          <h4 className="no-margin">{this.props.summary}</h4>
        </div>

        <div className="split">

          <div className="left">
            {
              // TODO Validate other event fields in a similar manner.
              this.props.start && this.props.end &&
              <p>{this.props.start} to {this.props.end}</p>
            }
            <p>{this.props.location}</p>
            <p>{description}</p>
          </div>

          {isIncomplete ? (
            <div className="right">
              <p>Incomplete.</p>
            </div>
          ) : (
            <div className="right">
              <p>{this.props.points} points per hour</p>
              <p>{this.props.type}</p>
            </div>
          )}
        </div>

        <div className="center">
          {isIncomplete ? (
            <button>Add</button>
          ) : (
            <button>View</button>
          )}
        </div>
      </div>
    );
  }
}

Event.propTypes = {
  summary: React.PropTypes.string.isRequired,
  description: React.PropTypes.string,
  location: React.PropTypes.string.isRequired,
  start: React.PropTypes.string.isRequired,
  end: React.PropTypes.string.isRequired,
  points: React.PropTypes.number,
  type: React.PropTypes.string,
};

export default Event;
