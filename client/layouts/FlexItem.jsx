import React from 'react';

const FlexItem = props => (
  // TODO Replace with classnames.
  <div className={`FlexItem ${props.className || ''}`}>
    {props.children}
  </div>
);

FlexItem.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
};

export default FlexItem;
