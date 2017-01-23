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
    const loggedInLinks = (
      <section className="navigation-item-group">
        <li className="navigation-item">
          <Link to="/profile" onClick={() => this.onSetOpen(false)}>Profile</Link>
        </li>
      </section>
    );

    const adminLinks = (
      <section className="navigation-item-group">
        <li className="navigation-item">
          <Link to="/admin" onClick={() => this.onSetOpen(false)}>Dashboard</Link>
        </li>

        <li className="navigation-item">
          <Link to="/admin/statistics" onClick={() => this.onSetOpen(false)}>Statistics</Link>
        </li>

      </section>
    );

    // Sets up navigation list in sidebar.
    const sidebarContent = (
      // TODO Remove dashboard depending on admin status of logged-in user.
      <div className="SidebarContent">
        <ul className="navigation-section">

          <section className="navigation-item-group">
            <li className="navigation-item">
              <Link to="/" onClick={() => this.onSetOpen(false)}>Events</Link>
            </li>
          </section>

          { this.state.isLoggedIn && loggedInLinks }
          { this.state.isLoggedIn && adminLinks }

          <section className="navigation-item-group">
            { // Displays either login or logout button.
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
          </section>

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
