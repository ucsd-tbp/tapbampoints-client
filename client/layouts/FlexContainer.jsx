import classnames from 'classnames';
import React from 'react';

const FlexContainer = props => (
  <div className={classnames('FlexContainer', props.className)}>
    {props.children}
  </div>
);

FlexContainer.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
};

export default FlexContainer;
