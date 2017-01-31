import React from 'react';
import { groupBy, isEmpty } from 'lodash';

import EventCard from '../components/EventCard';
import EventCategoryHeader from '../components/EventCategoryHeader';

const CategorizedEventList = (props) => {
  // Places events into categories, where each possible category is returned
  // from `groupingFunc`.
  const eventsByCategory = groupBy(props.events, props.groupingFunc);

  // Given the order of categories, creates an array of components with each
  // category and its events in the order specified in `props.categoryOrder`.
  const categorizedEvents = props.categoryOrder.reduce((accumulator, category, index) => {
    if (isEmpty(eventsByCategory[index])) return accumulator;

    // Adds a category and its set of events to the array of components for
    // rendering.
    const categoryHeader = <EventCategoryHeader key={index} category={category} />;
    const categoryEvents = eventsByCategory[index].map(event => (
      <EventCard
        key={event.id}
        event={event}
        onChange={props.onChange}
        onSubmit={props.onSubmit}
        displayForm
      />
    ));

    return [...accumulator, categoryHeader, ...categoryEvents];
  }, []);

  return <div>{categorizedEvents}</div>;
};

CategorizedEventList.propTypes = {
  // Props for grouping events.
  events: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  groupingFunc: React.PropTypes.func.isRequired,
  categoryOrder: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
};

export default CategorizedEventList;
