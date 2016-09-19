import React from 'react';

const TitlePanel = props => <h3>{props.title}</h3>;

TitlePanel.propTypes = {
  title: React.PropTypes.string.isRequired,
};

export default TitlePanel;
