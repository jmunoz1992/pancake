import React, { Component } from "react";
import { default as styled } from "styled-components";
import { Menu, Icon, Button, Dropdown } from "semantic-ui-react";

class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const renderedCreateModelButton = this.props.createModel;
    const renderedCreateLabelButton = this.props.createLabel;
    return (
      <Menu inverted className={this.props.className}>
        <Menu.Item>{renderedCreateModelButton}</Menu.Item>
        <Menu.Item>{renderedCreateLabelButton}</Menu.Item>
      </Menu>
    );
  }
}

const StyledToolbar = styled(Toolbar)`
  position: fixed;
  height: 60px;
  &&& {
    margin-bottom: 0px;
  }
  width: 100%;
  bottom: 0;
  left: -5px;
  z-index: 10000;
`;

export default StyledToolbar;
