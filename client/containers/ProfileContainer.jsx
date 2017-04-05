import React from 'react';

import Auth from '../modules/Auth';
import API from '../modules/API';
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

      pointsInfo: {
        academic: { attended: 0, total: 0 },
        social: { attended: 0, total: 0 },
        service: { attended: 0, total: 0 },
        wildcard: { attended: 0, total: 0 },
      },
    };
  }

  /**
   * Finds the JWT currently stored in local storage and loads the profile data
   * of the identified user.
   */
  componentDidMount() {
    Auth.verifyToken()
      .then(user => Promise.all([
        user, API.retrievePointsInfo(user.pid),
      ]))
      .then(([user, pointsInfo]) => this.setState({ user, pointsInfo }))
      .catch(error => console.error(error));
  }

  render() {
    return (
      <FlexContainer>
        <FlexItem className="double-width">
          {/* Shows points for each category. */}
          <p className="center light-emphasis small-caps no-margin">Points for Current Cycle</p>

          <PointsDisplay
            academic={this.state.pointsInfo.academic.total}
            social={this.state.pointsInfo.social.total}
            service={this.state.pointsInfo.service.total}
            wildcard={this.state.pointsInfo.wildcard.total}
          />

          {/* Shows events that this user has recently attended. */}
        </FlexItem>
        <FlexItem className="equal-width">
          <p>
            You're currently an initiate. The initiation cycle ends at the time of the Initiation
            Ceremony, which is at the end of April.
          </p>
          <p className="center"><span className="light-emphasis small-caps">House:</span> Red</p>
        </FlexItem>
      </FlexContainer>
    );
  }
}

export default ProfileContainer;
