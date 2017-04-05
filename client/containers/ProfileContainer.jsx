import React from 'react';
import { truncate, reduce } from 'lodash';

import Auth from '../modules/Auth';
import Events from '../modules/Events';
import API from '../modules/API';
import { Roles } from '../modules/constants';

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
      user: { attended_events: [] },

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
    // Finds the number of points and number of events attended total across
    // all the event types.
    const [totalAttended, totalPoints] = reduce(this.state.pointsInfo, (accumulator, type) => (
      [accumulator[0] + type.attended, accumulator[1] + type.total]
    ), [0, 0]);

    let eligbilityMessage;

    // The message on the sidebar depends on whether the logged-in user is an
    // initiate or a member, and whether they meet the corresponding
    // requirements.
    if (this.state.user.role === Roles.INITIATE) {
      eligbilityMessage = Events.meetsPointRequirements(this.state.pointsInfo) ? (
        <p className="light-emphasis">
          Based on the number and types of points you have, you are eligible for initiation.
        </p>
      ) : (
        <p className="light-emphasis">
          Based on the number and types of points you have, you are not eligible for
          initiation. You can check the initiation requirements on the
          <a href="http://tbp.ucsd.edu/requirements"> TBP website</a>.
        </p>
      );
    } else {
      eligbilityMessage = Events.meetsPointRequirements(this.state.pointsInfo, true) ? (
        <p className="light-emphasis">
          Based on the number of points you have, you will remain an active member next quarter.
        </p>
      ) : (
        <p className="light-emphasis">
          Based on the number of points you currently have, you are not eligible for active
          membership next quarter. You can check the active membership requirements on the
          <a href="http://tbp.ucsd.edu/benefits"> TBP website</a>.
        </p>
      );
    }

    const recentlyAttendedEvents = this.state.user.attended_events.map((event, index) => (
      <div key={index}>
        <h3>{event.summary || 'No summary provided.'}</h3>
        <p className="understated">
          Happened on {Events.formatDateRange(new Date(event.start), new Date(event.end))}
        </p>
        <p>{truncate(event.description, { length: 140 }) || 'No description provided.'}</p>
      </div>
    ));

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
          <p className="center light-emphasis small-caps">Recently Attended Events</p>

          {recentlyAttendedEvents.length > 0 ? recentlyAttendedEvents : (
            <p className="understated">No events attended recently. :(</p>
          )}

        </FlexItem>
        <FlexItem className="equal-width">
          <p className="light-emphasis">
            Right now, you have <strong>{totalPoints}</strong> points, and attended
            <strong> {totalAttended}</strong> events total during this initiation cycle.
          </p>

          {eligbilityMessage}

          <p className="understated">
            Is the number of points listed here incorrect? Contact the technology chair at
            <a className="understated" href="mailto:brtan@ucsd.edu"> brtan@ucsd.edu</a>.
          </p>
        </FlexItem>
      </FlexContainer>
    );
  }
}

export default ProfileContainer;
