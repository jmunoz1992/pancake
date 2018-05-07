import * as React from "react";

import { BodyWidget } from "./schemaPack/widgets/BodyWidget";
import { Application } from "./schemaPack/Application";
import "./schemaPack/css/main.css";

import { Navbar, Sidebar } from "./index";
import { Grid } from "semantic-ui-react";
import { default as styled } from "styled-components";

const Schema = () => {
	var app = new Application();
  return (<StyledAppWrapper>
    <Grid style={{ paddingTop: "0px" }}>
      <Grid.Row>
        <Navbar />
      </Grid.Row>
      <Grid.Row>
        <Grid.Column id="main">
          <BodyWidget app={app} />;
        </Grid.Column>
        <Grid.Column id="sidebar">
          <scrollcontainer>
            <Sidebar />
          </scrollcontainer>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </StyledAppWrapper>);
};


const StyledAppWrapper = styled.div `
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

  scroll-container {
    display: block;
    width: 400px;
    height: 600px;
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
`;

export default Schema;
