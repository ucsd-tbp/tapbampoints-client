/**
 * Primary container component for the entire application. Contains the
 * sidebar and updates the main content's title based on the route. The
 * component that corresponds to the clicked sidebar navigation item is
 * rendered in `this.props.children`.
 *
 * See https://github.com/balloob/react-sidebar for documentation on
 * sidebar component used.
 */

import React from 'react';
import Sidebar from 'react-sidebar';
import { Link } from 'react-router';

import MenuButton from './MenuButton';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onSetOpen = this.onSetOpen.bind(this);

    this.state = {
      sidebarOpen: false,
    };
  }

  onSetOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  render() {
    // Sets up navigation list in sidebar.
    const sidebarContent = (
      // TODO Remove dashboard depending on admin status of logged-in user.
      <div className="SidebarContent">
        <h3 className="SidebarContent header">TBPoints</h3>
        <ul className="SidebarContent navigation-list">
          <li className="SidebarContent navigation-list-item">
            <Link to="/" onClick={() => this.onSetOpen(false)}>Home</Link>
          </li>
          <li className="SidebarContent navigation-list-item">
            <Link to="/dashboard" onClick={() => this.onSetOpen(false)}>Dashboard</Link>
          </li>
        </ul>
      </div>
    );

    return (
      <Sidebar
        sidebar={sidebarContent}
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetOpen}
        sidebarClassName={'Sidebar'}
      >
        <MenuButton onClick={() => this.onSetOpen(true)} />
        <div className="App">
          {this.props.children}
        </div>
      </Sidebar>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
