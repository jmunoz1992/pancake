import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../store";
import { Menu, Header } from "semantic-ui-react";

const Navbar = ({ handleClick }) => (
  <Menu fixed="top" inverted size="huge" borderless fluid>
    <Menu.Item>Pancake</Menu.Item>
    <Menu.Item as="a" onClick={handleClick}>
      Logout
    </Menu.Item>
  </Menu>
);

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(null, mapDispatch)(Navbar);
