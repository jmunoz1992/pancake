import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store";
import { Menu, Dropdown } from "semantic-ui-react";
import styled from "styled-components";
import { default as FilterBox } from "./issues/filter-box";

const Navbar = props => {
  const { doLogout, className } = props;
  return (
    <Menu fixed="top" inverted size="huge" borderless fluid className={className}>
      <Menu.Item>
        <Dropdown
          trigger={<img src="/logo.png" width="auto" height="28px" />}
          icon={null}
          pointing="top left">
          <Dropdown.Menu>
            <Dropdown.Header>Logged in as {props.user.username}</Dropdown.Header>
            <Dropdown.Item>Projects</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={doLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
      <Menu.Item as="a" name="mockup" onClick={() => props.history.push("/mockups")}>
        Mockups
      </Menu.Item>
      <Menu.Item as="a" name="schema" onClick={() => props.history.push("/schema")}>
        Schema Designer
      </Menu.Item>
      <Menu.Item as="a" name="board" onClick={() => props.history.push("/board")}>
        Board
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>
          <FilterBox />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

const StyledNavbar = styled(Navbar) `
  &&& {
    box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.3);
  }
`;

const mapState = ({ user, issues }) => ({ user, issues });

const mapDispatch = dispatch => {
  return {
    doLogout(_, { name }) {
      dispatch(logout());
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(StyledNavbar));
