import React from 'react';

import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

/** Renders container components for home page at route index ('/'). */
const HomePage = () => (
  <FlexContainer className="HomePage">
    <FlexItem className="equal-width">
      <h3>Announcements</h3>
    </FlexItem>
    <FlexItem className="double-width">
      <p>Announcements go here.</p>
    </FlexItem>
  </FlexContainer>
);

export default HomePage;
