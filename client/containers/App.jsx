import React from 'react';
import Sidebar from 'react-sidebar';
import { Link, browserHistory } from 'react-router';

import Auth from '../modules/Auth';
import MenuButton from '../components/MenuButton';

/**
 * Primary container component for the entire application. Contains the
 * sidebar and updates the main content's title based on the route. The
 * component that corresponds to the clicked sidebar navigation item is
 * rendered in `this.props.children`.
 *
 * Also contains authentication state on whether a user or an officer is logged
 * in. Passes this authentication state down as props to children components.
 *
 * @see https://github.com/balloob/react-sidebar for documentation on
 * sidebar component used.
 */
class App extends React.Component {
  constructor(props) {
    super(props);

    this.onSetOpen = this.onSetOpen.bind(this);
    this.handleAuthChange = this.handleAuthChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      isSidebarOpen: false,
      loggedInUser: null,
    };
  }

  componentDidMount() {
    if (!Auth.isUserAuthenticated()) return;

    // When entering the application, retrieves the role based on the currently
    // stored token.
    Auth.verifyToken()
      .then(user => this.setState({ loggedInUser: user }));
  }

  onSetOpen(open) {
    this.setState({ isSidebarOpen: open });
  }

  handleAuthChange(currentUser) {
    this.setState({ loggedInUser: currentUser });
  }

  handleLogout() {
    this.setState({ isSidebarOpen: false, loggedInUser: null });
    Auth.deauthenticateUser();
    browserHistory.push('/');
  }

  render() {
    // Links that only appear when logged in.
    const loggedInLinks = (
      <section className="navigation-item-group">
        <li className="navigation-item">
          <Link to="/profile" onClick={() => this.onSetOpen(false)}>Profile</Link>
        </li>

        <li className="navigation-subitem">
          <Link to="/profile" onClick={() => this.onSetOpen(false)}>update info</Link>
        </li>
      </section>
    );

    // Links that only appear when the logged in user is an admin.
    const adminLinks = (
      <section className="navigation-item-group">
        <li className="navigation-item">
          <Link to="/admin" onClick={() => this.onSetOpen(false)}>Admin Dashboard</Link>
        </li>

        <li className="navigation-subitem">
          <Link to="/admin/events/create" onClick={() => this.onSetOpen(false)}>
            Create an Event
          </Link>
        </li>

        <li className="navigation-subitem">
          <Link to="/events" onClick={() => this.onSetOpen(false)}>Current Events</Link>
        </li>

        <li className="navigation-subitem">
          <Link to="/admin/announcements/create" onClick={() => this.onSetOpen(false)}>
            Make an Announcement
          </Link>
        </li>

        <li className="navigation-subitem">
          <Link to="/admin/statistics" onClick={() => this.onSetOpen(false)}>Statistics</Link>
        </li>
      </section>
    );

    // Sets up navigation list in sidebar.
    const sidebarContent = (
      <div className="SidebarContent">
        <ul className="navigation-section">

          <section className="navigation-item-group">
            <li className="navigation-item">
              <Link to="/" onClick={() => this.onSetOpen(false)}>Announcements</Link>
            </li>
          </section>

          { Auth.isUserAuthenticated() && loggedInLinks }
          { Auth.hasAdministrativePermission(this.state.loggedInUser) && adminLinks }

          <section className="navigation-item-group">
            { // Displays either login or logout button.
              Auth.isUserAuthenticated() ? (
                <li className="navigation-item">
                  <Link to="/" onClick={this.handleLogout}>Logout</Link>
                </li>
              ) : (
                <li className="navigation-item">
                  <Link to="/login" onClick={() => this.onSetOpen(false)}>Login/Register</Link>
                </li>
              )
            }
          </section>

        </ul>
      </div>
    );

    // Fades out black overlay when closing sidebar.
    const overlayStyles = {
      overlay: { transition: 'opacity .3s ease-out, visibility .3s ease-out' },
    };

    // Copies currently logged in user and auth change handler to all children as props.
    const childrenWithProps = React.Children.map(this.props.children,
      child => React.cloneElement(child,
        { loggedInUser: this.state.loggedInUser, onAuthChange: this.handleAuthChange },
      )
    );

    return (
      <Sidebar
        sidebar={sidebarContent}
        open={this.state.isSidebarOpen}
        onSetOpen={this.onSetOpen}
        sidebarClassName="Sidebar"
        styles={overlayStyles}
      >
        <MenuButton
          onClick={() => this.onSetOpen(!this.state.isSidebarOpen)}
          isSidebarOpen={this.state.isSidebarOpen}
        />
        <div className="App">
          {childrenWithProps}
        </div>
      </Sidebar>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
