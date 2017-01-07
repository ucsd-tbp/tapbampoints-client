/**
 * Primary container component for the entire application. Contains the
 * sidebar and updates the main content's title based on the route. The
 * component that corresponds to the clicked sidebar navigation item is
 * rendered in `this.props.children`.
 */

import React from 'react';
import Sidebar from 'react-sidebar';
import { Link } from 'react-router';

import MenuButton from './MenuButton';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      sidebarTransitions: false,
    };
  }

  handleClick() {
    console.log('App.jsx:handleClick()');
  }

  render() {
    // Sets up navigation list in sidebar.
    const sidebarContent = (
      // TODO Remove dashboard depending on admin status of logged-in user.
      <div className="Sidebar">
        <h3 className="Sidebar header">TBPoints</h3>
        <ul className="Sidebar navigation-list">
          <li className="Sidebar navigation-list-item"><Link to="/">Home</Link></li>
        </ul>
      </div>
    );

    // The react-sidebar package requires styles to be passed in as an object,
    // so styles for this component can't be put in an external SCSS file.
    const sidebarStyles = { sidebar: { width: '200px' } };

    return (
      <Sidebar
        sidebar={sidebarContent}
        transitions={this.state.sidebarTransitions}
        styles={sidebarStyles}
      >
        <MenuButton onClick={() => this.handleClick()} />
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
