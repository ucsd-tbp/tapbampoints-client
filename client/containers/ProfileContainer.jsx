import React from 'react';

import Auth from '../modules/Auth';
import FlexContainer from '../layouts/FlexContainer';
import FlexItem from '../layouts/FlexItem';
import PointsDisplay from '../components/PointsDisplay';

/**
 * Handles state associated with a user's profile, e.g. the User object
 * corresponding to the currently logged in user, retrieved from the API.
 */
class ProfileContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };
  }

  /**
   * Finds the JWT currently stored in local storage and loads the profile data
   * of the identified user.
   */
  componentDidMount() {
    Auth.verifyToken()
      .then(user => this.setState({ user }))
      .catch(error => console.error(error));
  }

  render() {
    return (
      <FlexContainer>
        <FlexItem className="double-width">
          {/* Shows points for each category. */}
          <p className="center light-emphasis small-caps no-margin">Points for Current Cycle</p>
          <PointsDisplay academic={5} social={0} service={2} wildcard={3} />

          {/* Shows events that this user has recently attended. */}
        </FlexItem>
        <FlexItem className="equal-width">
          <p>
            You're currently an initiate. The initiation cycle ends at the time of the Initiation
            Ceremony, which is at the end of April.
          </p>
          <p><span className="light-emphasis small-caps">House:</span> Red</p>
        </FlexItem>
      </FlexContainer>
    );
  }
}

export default ProfileContainer;
