import * as React from "react";

import { BodyWidget } from "./widgets/BodyWidget";
import { Application } from "./Application";
import "./css/main.css";

import { Navbar, Sidebar } from "../index";
import { Grid } from "semantic-ui-react";
import { default as styled } from "styled-components";

console.log("Schema render");
const Schema = props => {
  var app = new Application();
  return <BodyWidget app={app} />;
};

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
