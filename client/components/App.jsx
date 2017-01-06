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

// Object that associates routes with page titles.
const availableLinks = {
  '/': 'Events',
  '/dashboard': 'Dashboard',
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.updateTitle = this.updateTitle.bind(this);

    this.state = {
      title: '',
      sidebarTransitions: false,
    };
  }

  componentWillMount() {
    const mediaQueryList = window.matchMedia('(min-width: 800px)');
    mediaQueryList.addListener(this.mediaQueryChanged);

    this.updateTitle(availableLinks[this.props.location.pathname]);

    this.setState({
      mediaQueryList,
      sidebarDocked: mediaQueryList.matches,
    });
  }

  componentDidUpdate() {
    // Updates the title when the URL is manually changed
    if (this.state.title !== availableLinks[this.props.location.pathname]) {
      this.updateTitle(availableLinks[this.props.location.pathname]);
    }
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
    // Sets up navigation list in sidebar.
    const sidebarContent = (
      // TODO Remove dashboard depending on admin status of logged-in user.
      <div className="Sidebar">
        <h3 className="Sidebar header">TBPoints</h3>
        <ul className="Sidebar navigation-list">
          {
            // Creates list of navigation items by creating a link to the URI
            // in `availableLinks` object, and matches the page title in the
            // main content to the route.
            Object.keys(availableLinks).map((uri, index) =>
              <li key={index} className="Sidebar navigation-list-item">
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

    // The react-sidebar package requires styles to be passed in as an object,
    // so styles for this component can't be put in an external SCSS file.
    const sidebarStyles = { sidebar: { width: '200px' } };

    return (
      <Sidebar
        sidebar={sidebarContent}
        docked={this.state.sidebarDocked}
        transitions={this.state.sidebarTransitions}
        styles={sidebarStyles}
      >
        <div className="App">
          <TitlePanel title={this.state.title} />
          {this.props.children}
        </div>
      </Sidebar>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.node,
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string,
  }),
};

export default App;
