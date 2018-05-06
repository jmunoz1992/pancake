import React, {
  Component
} from "react";
import {
  Navbar,
  Sidebar,
  Schema
} from "./index";
import {
  connect
} from "react-redux";
import {
  withRouter
} from "react-router-dom";
import {
  fetchIssues
} from "../store";
import {
  Grid
} from "semantic-ui-react";
import {
  default as styled
} from "styled-components";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadIssues();
  }

  render() {
    return (
    <StyledAppWrapper >
        <Navbar />
        <Grid >
          <Grid.Row >
            <Grid.Column id = "main" >
              <Schema />
            </Grid.Column>
            <Grid.Column id = "sidebar" >
              <scroll-container>
                <Sidebar />
              </scroll-container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </StyledAppWrapper>
    );
  }
}

const StyledAppWrapper = styled.div `
  #main {
    width: 80%;
  }

  #sidebar {
    position: fixed;
    top: 3em;
    right: 0;
    width: 20%;
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
    loadIssues() {
      dispatch(fetchIssues());
    }
  };
};

export default withRouter(connect(null, mapDispatch)(App));
