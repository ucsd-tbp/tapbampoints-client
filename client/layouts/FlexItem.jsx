import classnames from 'classnames';
import React from 'react';

const FlexItem = props => (
  <div className={classnames('FlexItem', props.className)}>
    {props.children}
  </div>
);

FlexItem.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
};

export default FlexItem;
