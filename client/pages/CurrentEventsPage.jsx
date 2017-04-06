import React from 'react';

import { Roles } from '../modules/constants';
import CurrentEventsContainer from '../containers/CurrentEventsContainer';

const CurrentEventsPage = (props) => {
  const shouldDisplayProtectedRoutes = props.loggedInUser &&
    (props.loggedInUser.role.name === Roles.OFFICER
    || props.loggedInUser.role.name === Roles.ADMIN);

  return (
    <div className="CurrentEventsPage">
      <h3>Current Events</h3>
      <p>
        Below is a list of current events. Choose one of the events below to start sign-ups for a
        certain event.
      </p>

      <CurrentEventsContainer
        shouldDisplayProtectedRoutes={shouldDisplayProtectedRoutes}
      />
    </div>
  );
};

CurrentEventsPage.propTypes = {
  loggedInUser: React.PropTypes.shape({
    role: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  }),
};

export default CurrentEventsPage;
