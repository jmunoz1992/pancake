import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout, fetchPullRequests } from "../store";
import { Input, Menu, Header, Dropdown, Icon } from "semantic-ui-react";
import styled from "styled-components";
import { default as FilterBox } from "./issues/filter-box";
import { PullRequests } from "./pull-requests";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadPullRequests();
  }

  render() {
    const { doLogout, className, pullRequests } = this.props;
    return (
      <Menu fixed="top" inverted size="huge" borderless fluid className={className}>
        <Menu.Item>
          <Dropdown
            trigger={<img src="/logo.png" width="auto" height="28px" />}
            icon={null}
            pointing="top left">
            <Dropdown.Menu>
              <Dropdown.Header>Logged in as {this.props.user.username}</Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={doLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
        <Menu.Item as="a" name="home" onClick={() => this.props.history.push("/home")}>
          Home
        </Menu.Item>
        <Menu.Item as="a" name="mockup" onClick={() => this.props.history.push("/mockups")}>
          Mockups
        </Menu.Item>
        <Menu.Item as="a" name="schema" onClick={() => this.props.history.push("/schema")}>
          Schema
        </Menu.Item>
        <Menu.Item as="a" name="board" onClick={() => this.props.history.push("/board")}>
          Board
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <PullRequests allPullRequests={pullRequests} />
          </Menu.Item>
          <Menu.Item>
            <FilterBox />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

const StyledNavbar = styled(Navbar)`
  &&& {
    box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.3);
  }
`;

const mapState = ({ user, issues, pullRequests }) => ({ user, issues, pullRequests });

const mapDispatch = dispatch => {
  return {
    doLogout(_, { name }) {
      dispatch(logout());
    },
    loadPullRequests() {
      dispatch(fetchPullRequests());
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(StyledNavbar));
