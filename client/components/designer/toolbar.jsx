import React, { Component } from "react";
import { default as styled } from "styled-components";
import { Menu, Icon, Button, Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";
import { MockupSwitcher } from ".";
import { designerOperations } from "../../store";

class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Menu inverted className={this.props.className}>
        <Menu.Item>
          <MockupSwitcher />
        </Menu.Item>
      </Menu>
    );
  }
}

const StyledToolbar = styled(Toolbar)`
  position: absolute;
  height: 60px;
  &&& {
    margin-bottom: 60px;
  }
  width: 100%;
  bottom: 0;
  left: 0;
`;

export default StyledToolbar;
