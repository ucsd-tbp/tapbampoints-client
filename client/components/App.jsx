import React from 'react';
import Sidebar from 'react-sidebar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sidebarTransitions: false };
  }

  componentWillMount() {
    const mediaQueryList = window.matchMedia('(min-width: 800px)');
    mediaQueryList.addListener(this.mediaQueryChanged.bind(this));

    this.setState({
      mediaQueryList,
      sidebarDocked: mediaQueryList.matches,
    });
  }

  componentWillUnmount() {
    this.state.mediaQueryList.removeListener(this.mediaQueryChanged.bind(this));
  }

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
        <h3>Main content.</h3>
      </Sidebar>
    );
  }
}

export default App;
