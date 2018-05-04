import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store";
import { Menu, Header, Dropdown } from "semantic-ui-react";
import styled from "styled-components";

const Navbar = props => {
  const { doLogout, className } = props;
  return (
    <Menu fixed="top" inverted size="huge" borderless fluid className={className}>
      <Menu.Item>
        <img src="/logo.png" />
      </Menu.Item>
      <Dropdown item text="Mockups">
        <Dropdown.Menu>
          <Dropdown.Item as="a" name="wireframes.1" onClick={() => props.history.push("/wireframes")}>
            Mockup 1
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as="a" name="wireframe.new" onClick={() => props.history.push("/wireframes")}>
            Create New
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Menu.Item as="a" name="schema" onClick={() => props.history.push("/schema")}>
        Schema Designer
      </Menu.Item>
      <Menu.Item as="a" name="test" onClick={() => props.history.push("/stats")}>
        Stats
      </Menu.Item>
      <Menu.Item position="right" name="logout" as="a" onClick={doLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

const StyledNavbar = styled(Navbar)`
  &&& {
    box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.3);
  }
`;

const mapDispatch = dispatch => {
  return {
    doLogout(_, { name }) {
      dispatch(logout());
    }
  };
};

export default withRouter(connect(null, mapDispatch)(StyledNavbar));
