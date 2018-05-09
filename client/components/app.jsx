import React, { Component } from "react";
import { Navbar, Sidebar, DesignerCanvas, DesignerProperties, DesignerToolbox, Schema } from "./index";
import { connect } from "react-redux";
import { withRouter, Switch, Route } from "react-router-dom";
import { fetchIssues, designerOperations, fetchCollaborators, fetchLabels } from "../store";

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
          <Grid.Row>
            <Grid.Column id="main">
              <Switch>
                <Route path="/wireframes" component={DesignerCanvas} />
                <Route path="/schema" component={Schema} />
                <Route
                  render={() => (
                    <div>
                      <h2>No matching route</h2>
                    </div>
                  )}
                />
              </Switch>
            </Grid.Column>
            <Grid.Column id="sidebar">
              <Switch>
                {/* <Route path="/wireframes" component={DesignerProperties} /> */}
                <Route path="/wireframes" component={DesignerToolbox} />
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
    width: calc(100% - 275px);
    height: 100vh;
    overflow: hidden;
  }

  #sidebar {
    position: fixed;
    top: 60px;
    right: 0;
    width: 275px;
    min-height: 100%;
    box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.3);
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
    },

    }
  };
};

export default withRouter(connect(null, mapDispatch)(App));
