import React from 'react';

import CategorizedEventList from '../components/CategorizedEventList';

/**
 * Retrieves all events from the API and lists them in categories. These events
 * are events that have already been created by officers via the Google
 * calendar, and manually copied over the Google calendar events to the API.
 */
class CurrentEventsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eventsByID: {},
    };
  }

  /**
   * After this component is loaded, an API request is made to get all events
   * within a certain date range.
   */
  componentDidMount() {

  }

  render() {
    return <h3>Events from the API.</h3>;
  }
}

export default CurrentEventsContainer;
