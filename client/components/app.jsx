import React, { Component } from "react";
import { Navbar, Sidebar } from "./index";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchIssues } from "../store";
import { Grid } from "semantic-ui-react";
import { default as styled } from "styled-components";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadIssues();
  }

  render() {
    return (
      <StyledAppWrapper>
        <Navbar />
        <Grid>
          <Grid.Row>
            <Grid.Column id="main">
              <h2>Main Content</h2>
              <p>Render the appropriate Main component here.</p>
            </Grid.Column>
            <Grid.Column id="sidebar">
              <h2>Sidebar</h2>
              <p>Render the appropriate Sidebar component here.</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </StyledAppWrapper>
    );
  }
}

const StyledAppWrapper = styled.div`
  #main {
    width: 80%;
  }

  #sidebar {
    position: fixed;
    top: 3em;
    right: 0;
    width: 20%;
  }
`;

const mapDispatch = dispatch => {
  return {
    loadIssues() {
      dispatch(fetchIssues());
    }
  };
};

export default withRouter(connect(null, mapDispatch)(App));
