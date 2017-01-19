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
      isLoggedIn: Auth.isUserAuthenticated(),
    };
  }

  /**
   * Opens or closes the sidebar depending on value of `open`.
   */
  onSetOpen(open) {
    this.setState({ isSidebarOpen: open });
  }

  handleAuthChange(isLoggedIn) {
    this.setState({ isLoggedIn });
  }

  handleLogout() {
    this.setState({ isSidebarOpen: false, isLoggedIn: false });
    Auth.deauthenticateUser();
    browserHistory.push('/');
  }

  render() {
    // Sets up navigation list in sidebar.
    const sidebarContent = (
      // TODO Remove dashboard depending on admin status of logged-in user.
      <div className="SidebarContent">
        <ul className="navigation-section">

          <li className="navigation-item">
            <Link to="/" onClick={() => this.onSetOpen(false)}>Events</Link>
          </li>

          {
            // TODO Should only need one ternary operator for this logic.
            // Fields to display if the user is logged in.
            this.state.isLoggedIn &&
            <li className="navigation-item">
              <Link to="/dashboard" onClick={() => this.onSetOpen(false)}>Dashboard</Link>
            </li>
          }

          {
            // Fields to display if the user is logged in.
            this.state.isLoggedIn &&
            <li className="navigation-item">
              <Link to="/dashboard" onClick={() => this.onSetOpen(false)}>Users</Link>
            </li>
          }

          {
            // Shows login or logout buttons depending on whether user is logged in.
            this.state.isLoggedIn ? (
              <li className="navigation-item">
                <Link to="/" onClick={this.handleLogout}>Logout</Link>
              </li>
            ) : (
              <li className="navigation-item">
                <Link to="/login" onClick={() => this.onSetOpen(false)}>Login/Register</Link>
              </li>
            )
          }

        </ul>
      </div>
    );

    // Fades out black overlay when closing sidebar.
    const overlayStyles = {
      overlay: { transition: 'opacity .3s ease-out, visibility .3s ease-out' },
    };

    // Copies isLoggedIn and onAuthChange to all children as props.
    const childrenWithProps = React.Children.map(this.props.children,
      child => React.cloneElement(child,
        { isLoggedIn: this.state.isLoggedIn, onAuthChange: this.handleAuthChange },
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
