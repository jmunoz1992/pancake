import * as React from "react";

import { BodyWidget } from "./widgets/BodyWidget";
import { Application } from "./Application";
import "./css/main.css";

import { Navbar, Sidebar } from "../index";
import { Grid } from "semantic-ui-react";
import { default as styled } from "styled-components";
import { connectToSession } from "../../socket/schema";

class Schema extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diagramJson: ""
    };
  }

  componentDidMount() {
    console.log("Schema componentDidMount");
    connectToSession(newJson => {
      this.setState({ diagramJson: newJson });
    });
  }

  render() {
    var app = new Application(this.state.diagramJson);
    return <BodyWidget app={app} />;
  }
}

const StyledAppWrapper = styled.div`
  #main {
    width: calc(100%);
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

export default Schema;
