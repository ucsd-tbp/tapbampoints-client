import React from 'react';
import classnames from 'classnames';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

/**
 * Shows a series of buttons, each with a point value to pass to the `onSubmit`
 * function. Used when determining how many points to assign an event attendee.
 */
const PointSelectionForm = props => (
  <FlexContainer className={classnames('PointSelectionForm', props.className)}>
    <form className="primary-number-input" onSubmit={props.onSubmit}>
      <FlexItem>
        <input
          name="points"
          type="number"
          value={props.pointsToAssign}
          min="0"
          max={props.max}
          onChange={props.onChange}
        />
      </FlexItem>

      <FlexItem>
        <label htmlFor="points">point(s)</label>
      </FlexItem>

      <FlexItem className="wrapped-button">
        <input type="submit" value="Submit" />
      </FlexItem>
    </form>

  </FlexContainer>
);

PointSelectionForm.propTypes = {
  pointsToAssign: React.PropTypes.number.isRequired,
  max: React.PropTypes.number.isRequired,
  className: React.PropTypes.string,

  onChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
};

export default PointSelectionForm;
