import React from 'react';

const FlexItem = props => (
  <div className="FlexItem">
    {props.children}
  </div>
);

FlexItem.propTypes = {
  children: React.PropTypes.node,
};

export default FlexItem;
