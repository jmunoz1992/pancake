import React, { Component } from "react";
import {
  Navbar,
  DesignerCanvas,
  DesignerSidebar,
  Schema,
  SchemaSidebar,
  SocketModal,
  Issues,
  Board
} from "./index";
import { connect } from "react-redux";
import { withRouter, Switch, Route } from "react-router-dom";
import { fetchIssues, fetchCollaborators, fetchLabels } from "../store";

import { Grid } from "semantic-ui-react";
import { default as styled } from "styled-components";

class App extends Component {
  componentDidMount() {
    this.props.loadCollaborators();
    this.props.loadIssues();
    this.props.loadLabels();
  }

  render() {
    return (
      <StyledAppWrapper>
        <Grid style={{ paddingTop: "0px" }}>
          <Grid.Row>
            <Navbar />
          </Grid.Row>
          <Route path="/mockups" component={SocketModal} />
          <Grid.Row>
            <Grid.Column id="main">
              <Switch>
                <Route path="/mockups" component={DesignerCanvas} />
                <Route path="/schema" component={Schema} />
                <Route path="/board" component={Board} />
                <Route component={Board} />
              </Switch>
            </Grid.Column>
            <Grid.Column id="sidebar">
              <Switch>
                <Route path="/mockups" component={DesignerSidebar} />
                <Route path="/schema" component={SchemaSidebar} />
                <Route component={Issues} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </StyledAppWrapper>
    );
  }
}

const StyledAppWrapper = styled.div`
  #main {
    position: fixed;
    top: 60px;
    height: 100%;
    width: calc(100% - 260px);
    overflow: hidden;
  }

  #sidebar {
    position: fixed;
    background: white;
    top: 60px;
    right: 0;
    bottom: 0;
    width: 300px;
    box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.3);
    /* padding-right: 0px; */
  }

  scroll-container {
    display: block;
    width: 400px;
    height: 600px;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
`;

const mapDispatch = dispatch => {
  return {
    loadCollaborators() {
      dispatch(fetchCollaborators());
    },
    loadIssues() {
      dispatch(fetchIssues());
    },
    loadLabels() {
      dispatch(fetchLabels());
    }
  };
};

export default withRouter(connect(null, mapDispatch)(App));
