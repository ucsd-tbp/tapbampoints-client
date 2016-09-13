import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return <h3>App component.</h3>
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('main-container')
);
