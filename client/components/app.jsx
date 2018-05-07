import React, { Component } from "react";
import { Navbar, Sidebar, DesignerCanvas, DesignerProperties, Schema } from "./index";
import { connect } from "react-redux";
import { withRouter, Switch, Route } from "react-router-dom";
import { fetchIssues, designerOperations } from "../store";
import { Grid } from "semantic-ui-react";
import { default as styled } from "styled-components";


class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadIssues();
    this.props.addDemoTextboxes();
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
                <Route path="/wireframes" component={DesignerProperties} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </StyledAppWrapper>
    );
  }
}

const StyledAppWrapper = styled.div `
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

  scroll-container {
    display: block;
    width: 400px;
    height: 600px;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
`;

// TODO: remove textbox demo code
import { Textbox } from "./designer/elements";
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const mapDispatch = dispatch => {
  return {
    loadIssues() {
      dispatch(fetchIssues());
    },
    addDemoTextboxes() {
      for (let i = 0; i < 10; i++) {
        const textbox = new Textbox();
        textbox.top = getRandomIntInclusive(0, 1000);
        textbox.left = getRandomIntInclusive(0, 1000);
        dispatch(designerOperations.createNewElement(textbox));
      }
    }
  };
};

export default withRouter(connect(null, mapDispatch)(App));
