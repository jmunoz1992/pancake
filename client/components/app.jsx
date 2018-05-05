import React, { Component } from "react";
import { Navbar, Sidebar, DesignerCanvas } from "./index";
import { connect } from "react-redux";
import { withRouter, Switch, Route } from "react-router-dom";
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
        <Grid style={{ paddingTop: "0px" }}>
          <Grid.Row style={{ height: "60px" }}>
            <Navbar />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column id="main">
              <Switch>
                <Route path="/wireframes" component={DesignerCanvas} />
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
    width: calc(100% - 275px);
    height: 2000px;
    overflow: hidden;
  }

  #sidebar {
    position: fixed;
    top: 60px;
    right: 0;
    width: 275px;
    min-height: 100%;
    box-shadow: 0px 0px 30px 4px rgba(0, 0, 0, 0.3);
    z-index: 1;
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
