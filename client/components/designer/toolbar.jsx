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
        <Menu.Item header>Sort By</Menu.Item>

        <Menu.Item>
          <MockupSwitcher />
        </Menu.Item>
        {this.props.selectedElements.length ? this.renderElementTools() : this.renderNothing()}
      </Menu>
    );
  }

  renderNothing() {
    return (
      <Menu.Menu>
        <Menu.Item>Nothing selected.</Menu.Item>
      </Menu.Menu>
    );
  }

  renderElementTools() {
    return (
      <Menu.Menu>
        <Menu.Item>Something selected.</Menu.Item>
      </Menu.Menu>
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
  z-index: 10000;
`;

const mapState = state => {
  return { selectedElements: state.designer.selectedElements };
};

export default connect(mapState, null)(StyledToolbar);
