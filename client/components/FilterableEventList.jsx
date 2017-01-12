import React from 'react';

import Event from './Event';

class FilterableEventList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentEvents: [],
    };
  }

  componentDidMount() {
    fetch(`${process.env.API_ROOT}/events?embed=type`)
      .then((response) => {
        response.json().then(data => this.setState({ currentEvents: data }));
      })
      .catch(error => console.error(error));
  }

  render() {
    console.log(this.state.currentEvents);

    const currentEvents = this.state.currentEvents.map(event =>
      <Event
        key={event.id}
        summary={event.summary}
        description={event.description || 'No description provided.'}
        location={event.location}
        start={event.start|| (new Date()).toISOString()}
        end={event.end|| (new Date()).toISOString()}
        points={event.points}
        type={event.type.summary}
      />
    );

    return (
      <div>
        <h3>Upcoming Events</h3>
        <p>
          Below are some upcoming events! Choose one of the events below to look at
          in more detail. To start sign-ups for an event, go to one of the event
          pages below and hit "Sign-in" to start recording sign-ins at
          the event.
        </p>

        {currentEvents}
      </div>
    );
  }
}

export default FilterableEventList;
