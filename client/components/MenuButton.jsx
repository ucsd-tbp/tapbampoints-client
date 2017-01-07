import React from 'react';

const MenuButton = props =>
  <div onClick={() => props.onClick()}>
    <i className="fa fa-bars fa-5x" aria-hidden="true" />
  </div>;

MenuButton.propTypes = {
  onClick: React.PropTypes.func,
};

export default MenuButton;
