import React from 'react';

import AnnouncementListContainer from '../containers/AnnouncementListContainer';
import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';

/** Renders container components for home page at route index ('/'). */
const HomePage = () => (
  <FlexContainer className="HomePage">
    <FlexItem className="equal-width">
      <h3>Announcements</h3>
      <p>Check out the latest announcements!</p>
    </FlexItem>
    <FlexItem className="double-width">
      <AnnouncementListContainer />
    </FlexItem>
  </FlexContainer>
);

export default HomePage;
