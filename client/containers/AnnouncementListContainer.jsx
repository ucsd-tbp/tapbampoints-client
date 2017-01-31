import React from 'react';

import Announcement from '../components/Announcement';
import API from '../modules/API';

class AnnouncementListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      announcements: [],
    };
  }

  componentDidMount() {
    // TODO Extract this function to a utility function in API module.
    const convertTimestampstoDates = (announcement) => {
      const announcementCopy = announcement;

      announcementCopy.created_at = new Date(announcement.created_at);
      announcementCopy.updated_at = new Date(announcement.updated_at);

      return announcementCopy;
    };

    // Retrieves all announcements and assigns to state.
    API.retrieveAnnouncements()
      .then((announcements) => {
        const sanitizedAnnouncements = announcements.map(convertTimestampstoDates);
        this.setState({ announcements: sanitizedAnnouncements });
      });
  }

  render() {
    // Changes timestamp fields in each announcement from JSON response from
    // SQL datetime strings to Date objects.
    const announcements = this.state.announcements.map(announcement =>
      <Announcement
        key={announcement.id}
        summary={announcement.summary}
        description={announcement.description}
        updatedAt={announcement.updated_at}
      />
    );

    return <div>{announcements}</div>;
  }
}

export default AnnouncementListContainer;
