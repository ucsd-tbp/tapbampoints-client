import React from 'react';

const MenuButton = props =>
  <div
    className={props.isSidebarOpen ? 'MenuButton opened' : 'MenuButton'}
    onClick={props.onClick}
  >
    <span className="menu-button-line" />
    <span className="menu-button-line" />
    <span className="menu-button-line" />
  </div>;

MenuButton.propTypes = {
  onClick: React.PropTypes.func,
  isSidebarOpen: React.PropTypes.bool,
};

export default MenuButton;
