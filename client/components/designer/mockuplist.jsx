import React, { Component } from "react";
import { default as Library } from "./elements";
import { connect } from "react-redux";
import { Accordion } from "semantic-ui-react";
import styled from "styled-components";
import ToolboxItem from "./toolboxitem";
import { designerOperations } from "../../store";

class MockupList extends Component {
  constructor(props) {
    super(props);
    this.props = {};
  }

  render() {
    return <h1>Mockup List</h1>;
  }
}

export default connect(null, null)(MockupList);
