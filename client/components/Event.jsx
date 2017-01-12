import React from 'react';
import format from 'date-fns/format';

import Auth from '../modules/Auth';

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      points: 0,
      type: '',
    };
  }

  // TODO Extract this to a utility function.
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    const TYPES = {
      academic: 1,
      social: 2,
      service: 3,
    };

    event.preventDefault();
    this.props.onSubmit(this.props.id, {
      summary: this.props.summary,
      description: this.props.description,
      points: this.state.points,
      location: this.props.location,
      type_id: TYPES[this.state.type],
      start: format(new Date(this.props.start), 'YYYY-MM-DD HH:mm:ss'),
      end: format(new Date(this.props.end), 'YYYY-MM-DD HH:mm:ss'),
    });
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

    const startDate = new Date(this.props.start);
    const endDate = new Date(this.props.end);

    const formattedDate = format(startDate, 'MMMM D, YYYY');
    const formattedStartTime = format(startDate, 'h:mm A');
    const formattedEndTime = format(endDate, 'h:mm A');

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
              <p>On {formattedDate}, from {formattedStartTime} to {formattedEndTime}</p>
            }
            <p>{this.props.location}</p>
            <p>{description}</p>
          </div>

          {isIncomplete ? (
            <div className="right">
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="points">
                  <input
                    name="points"
                    type="text"
                    value={this.state.points}
                    onChange={this.handleChange}
                    placeholder="max number of points"
                  />
                </label>

                <label htmlFor="type">
                  <input
                    name="type"
                    type="text"
                    value={this.state.type}
                    onChange={this.handleChange}
                    placeholder="academic, social, or service"
                  />
                </label>

                <input type="submit" value="Create" />
              </form>
            </div>
          ) : (
            <div className="right">
              <p>{this.props.points} points maximum</p>
              <p>{this.props.type}</p>
            </div>
          )}
        </div>

        <div className="center">
          {!isIncomplete && Auth.isUserAuthenticated() && <button>Start Sign-ins</button>}
          {!isIncomplete && <button>View</button>}
        </div>

      </div>
    );
  }
}

Event.propTypes = {
  id: React.PropTypes.string,
  summary: React.PropTypes.string.isRequired,
  description: React.PropTypes.string,
  location: React.PropTypes.string.isRequired,
  start: React.PropTypes.string.isRequired,
  end: React.PropTypes.string.isRequired,
  points: React.PropTypes.number,
  type: React.PropTypes.string,
  onSubmit: React.PropTypes.func,
};

export default Event;
