import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store";
import { Menu, Header, Dropdown } from "semantic-ui-react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Navbar = props => {
  const { doLogout, className } = props;
  return (
    <Menu fixed="top" inverted size="huge" borderless fluid className={className}>
      <Menu.Item>
        <Link to={"/home"} style={{}}>
          <img src="/logo.png" width="auto" height="27px" />
        </Link>
      </Menu.Item>
      <Menu.Item as="a" name="mockup" onClick={() => props.history.push("/mockups")}>
        Mockups
      </Menu.Item>
      <Menu.Item as="a" name="schema" onClick={() => props.history.push("/schema")}>
        Schema Designer
      </Menu.Item>
      <Menu.Item as="a" name="test" onClick={() => props.history.push("/board")}>
        Board
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
