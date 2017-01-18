import React from 'react';

/**
 * Evenly divides a page into two equal columns.
 */
const TwoColumnSplit = () => (
  <div className="TwoColumnSplit">

    <div className="left-column">
      {this.props.children[0]}
    </div>

    <div className="right-column">
      {this.props.children[1]}
    </div>

  </div>
);

export default TwoColumnSplit;
