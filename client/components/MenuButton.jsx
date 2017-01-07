import React from 'react';

const MenuButton = props =>
  <div className="MenuButton" onClick={() => props.onClick()}>
    <i className="MenuButton icon light-emphasis fa fa-bars fa-2x" aria-hidden="true" />
  </div>;

MenuButton.propTypes = {
  onClick: React.PropTypes.func,
};

export default MenuButton;
