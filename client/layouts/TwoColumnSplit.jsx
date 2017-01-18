import React from 'react';

/**
 * Evenly divides a page into two equal columns given exactly two children.
 * @see AuthenticationPage component for example usage.
 */
const TwoColumnSplit = props => (
  <div className="TwoColumnSplit">
    <div className="left-column">
      {props.children[0]}
    </div>
    <div className="right-column">
      {props.children[1]}
    </div>
  </div>
);

TwoColumnSplit.propTypes = {
  children: React.PropTypes.node,
};

export default TwoColumnSplit;
