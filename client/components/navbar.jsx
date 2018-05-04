import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../store";
import { Menu, Header } from "semantic-ui-react";

const Navbar = ({ handleClick }) => (
  <Menu fixed="top" inverted size="huge" borderless fluid>
    <Menu.Item>
      <img src="/logo.png" /> Pancake
    </Menu.Item>
    <Menu.Item as="a" name="wireframe" onClick={handleClick}>
      Wireframe
    </Menu.Item>
    <Menu.Item as="a" name="schema" onClick={handleClick}>
      Schema
    </Menu.Item>
    <Menu.Item as="a" name="test" onClick={handleClick}>
      Test
    </Menu.Item>
    <Menu.Item position="right" name="logout" as="a" onClick={handleClick}>
      Logout
    </Menu.Item>
  </Menu>
);

const mapDispatch = dispatch => {
  return {
    handleClick(_, { name }) {
      switch (name) {
        case "wireframe":
          break;
        case "schema":
          break;
        case "logout":
          dispatch(logout());
          break;
      }
    }
  };
};

export default connect(null, mapDispatch)(Navbar);
