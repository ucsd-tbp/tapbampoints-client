/**
 * Primary container component for the entire application. Contains the
 * sidebar and updates the main content's title based on the route. The
 * component that corresponds to the clicked sidebar navigation item is
 * rendered in `this.props.children`.
 */

import React from 'react';
import Sidebar from 'react-sidebar';
import { Link } from 'react-router';

import TitlePanel from './TitlePanel';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.updateTitle = this.updateTitle.bind(this);

    this.state = {
      title: 'Events',
      sidebarTransitions: false,
    };
  }

  componentWillMount() {
    const mediaQueryList = window.matchMedia('(min-width: 800px)');
    mediaQueryList.addListener(this.mediaQueryChanged);

    this.setState({
      mediaQueryList,
      sidebarDocked: mediaQueryList.matches,
    });
  }

  componentWillUnmount() {
    this.state.mediaQueryList.removeListener(this.mediaQueryChanged);
  }

  /**
   * Hides the sidebar depending on the width of the window.
   * @private
   */
  mediaQueryChanged() {
    this.setState({ sidebarDocked: this.state.mediaQueryList.matches });
  }

  /**
   * Updates title panel above main content depending on the route.
   * @param  {string} title Title to update title panel with.
   * @private
   */
  updateTitle(title) {
    this.setState({ title });
  }

  render() {
    // Object that associates routes with page titles.
    const availableLinks = {
      '/': 'Events',
      '/dashboard': 'Dashboard',
    };

    // Sets up navigation list in sidebar.
    const sidebarContent = (
      // TODO Remove dashboard depending on admin status of logged-in user.
      <div>
        <h3>Navigation</h3>
        <ul>
          {
            // Creates list of navigation items by creating a link to the URI
            // in `availableLinks` object, and matches the page title in the
            // main content to the route.
            Object.keys(availableLinks).map((uri, index) =>
              <li key={index}>
                <Link
                  onClick={() => this.updateTitle(availableLinks[uri])}
                  to={uri}
                >
                  {availableLinks[uri]}
                </Link>
              </li>
            )
          }
        </ul>
      </div>
    );

    return (
      <Sidebar
        sidebar={sidebarContent}
        docked={this.state.sidebarDocked}
        transitions={this.state.sidebarTransitions}
      >
        <TitlePanel title={this.state.title} />
        {this.props.children}
      </Sidebar>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
};

export default App;
