import React from 'react';

const FlexContainer = props => (
  <div className="FlexContainer">
    {props.children}
  </div>
);

FlexContainer.propTypes = {
  children: React.PropTypes.node,
};

export default FlexContainer;
