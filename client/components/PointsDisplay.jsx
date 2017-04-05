import React from 'react';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

/**
 * Shows points for each category in a readable format.
 */
const PointsDisplay = props => (
  <FlexContainer className="PointsDisplay">
    <FlexItem className="category-display">
      <h1 className="academic-color center">{props.academic}</h1>
      <p className="understated small-caps">Academic</p>
    </FlexItem>

    <FlexItem className="category-display">
      <h1 className="social-color center">{props.social}</h1>
      <p className="understated small-caps">Social</p>
    </FlexItem>

    <FlexItem className="category-display">
      <h1 className="service-color center">{props.service}</h1>
      <p className="understated small-caps">Service</p>
    </FlexItem>

    <FlexItem className="category-display">
      <h1 className="wildcard-color center">{props.wildcard}</h1>
      <p className="understated small-caps">Wildcard</p>
    </FlexItem>
  </FlexContainer>
);

PointsDisplay.propTypes = {
  academic: React.PropTypes.number,
  social: React.PropTypes.number,
  service: React.PropTypes.number,
  wildcard: React.PropTypes.number,
};

export default PointsDisplay;
