import React from 'react';
import { subWeeks, addMonths } from 'date-fns';
import { keyBy, values } from 'lodash';

import API from '../modules/API';
import CategorizedEventList from '../components/CategorizedEventList';
import { ORDERED_MONTHS } from '../modules/constants';

/**
 * Retrieves all events from the API and lists them in categories. These events
 * are events that have already been created by officers via the Google
 * calendar, and manually copied over the Google calendar events to the API.
 */
class CurrentEventsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      eventsByID: {},
    };
  }

  /**
   * After this component is loaded, an API request is made to get all events
   * within a certain date range.
   */
  componentDidMount() {
    // Constructs URL with a date range to get events between.
    const lowerDateBound = subWeeks(new Date(), 9);
    const upperDateBound = addMonths(new Date(), 1);

    API.retrieveEventsBetween(lowerDateBound, upperDateBound)
      .then(events => this.setState({ eventsByID: keyBy(events, 'id') }));
  }

  handleChange() {
    console.warn('firing CurrentEventsContainer#handleChange');
  }

  handleSubmit(event) {
    event.preventDefault();
    console.warn('firing CurrentEventsContainer#handleSubmit');
  }

  render() {
    return (
      <CategorizedEventList
        // BUG Object.values doesn't work in Safari, have to use Lodash. (??)
        events={values(this.state.eventsByID)}
        groupingFunc={event => event.start.getMonth()}
        categoryOrder={ORDERED_MONTHS}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default CurrentEventsContainer;
