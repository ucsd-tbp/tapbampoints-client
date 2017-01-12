import React from 'react';
import 'whatwg-fetch';

import Event from './Event';

import API from '../modules/API';
import Auth from '../modules/Auth';

class SuggestedEventList extends React.Component {
  constructor(props) {
    super(props);

    this.addEvent = this.addEvent.bind(this);

    this.state = {
      suggestedEvents: [],
    };
  }

  componentDidMount() {
    // Makes a date range between one month ago and one month in the future.
    const upperBound = new Date();
    const lowerBound = new Date();

    // TODO Replace with functions from date-fns.
    upperBound.setMonth(upperBound.getMonth() + 1);
    lowerBound.setMonth(lowerBound.getMonth() - 1);

    // Constructs URL to make GET request to using the date range.
    const dateBounds = `timeMin=${lowerBound.toISOString()}&timeMax=${upperBound.toISOString()}`;
    const requestURL = `${process.env.CALENDAR_API_ROOT}&${dateBounds}`;

    // Only retrieves events in the two-month date range, sorted by start date
    // in ascending order.
    fetch(requestURL)
      .then((response) => {
        response.json().then((data) => {
          // Reverses array so that events are sorted in descending order.
          data.items.reverse();

          this.setState({ suggestedEvents: data.items });
        });
      })
      .catch(error => console.error(error));
  }

  addEvent(id, newEvent) {
    // TODO Convert array to a set to avoid going through all events.
    const updatedEvents = this.state.suggestedEvents.filter(event => event.id !== id);

    this.setState({ suggestedEvents: updatedEvents });

    const request = new Request(`${process.env.API_ROOT}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    });

    console.log(newEvent);

    fetch(request)
      .then(API.checkStatus)
      .then((response) => {
        response.json().then((data) => {
          console.log(data);
        });
      })
      .catch((error) => {
        // TODO Modify API.checkStatus to avoid creating another Promise.
        error.json().then((data) => {
          console.error(data.error);
        });
      });
  }

  render() {
    const suggestedEvents = this.state.suggestedEvents.map(event =>
      <Event
        key={event.id}
        summary={event.summary}
        description={event.description || 'No description provided.'}
        location={event.location}
        start={event.start.dateTime || ''}
        end={event.end.dateTime || ''}
        onSubmit={this.addEvent}
        id={event.id}
      />
    );

    return (
      <div>
        <p>
          Below are events taken from the public Tau Beta Pi events Google
          calendar. These events typically already have the name, location,
          start and end times, and date already filled in, but in order to
          start signing in members, each event needs to know its type (either
          social/house, academic/professional, or outreach/service), and how
          many points maximum it's worth. You can fill in those fields below.
        </p>

        {suggestedEvents}
      </div>
    );
  }
}

export default SuggestedEventList;
