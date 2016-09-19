import React from 'react';
import Sidebar from 'react-sidebar';

import TitlePanel from './TitlePanel';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);

    this.state = { sidebarTransitions: false };
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

  render() {
    const sidebarContent = <h3>Sidebar content.</h3>;

    return (
      <Sidebar
        sidebar={sidebarContent}
        docked={this.state.sidebarDocked}
        transitions={this.state.sidebarTransitions}
      >
        <TitlePanel title={'Events'} />
      </Sidebar>
    );
  }
}

export default App;
