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
          <span className="header">Change Mockup</span>
          <MockupSwitcher />
        </Menu.Item>
        {this.props.selectedElements.length ? this.renderElementTools() : this.renderNothing()}
      </Menu>
    );
  }

  renderNothing() {
    return (
      <Menu.Menu>
        <Menu.Item>
          Tip: You can select multiple elements by holding down the Shift key.<br />Hold down the Alt/Option
          key to hide the selected elements.
        </Menu.Item>
      </Menu.Menu>
    );
  }

  renderElementTools() {
    return (
      <Menu.Menu>
        <Menu.Item>
          <Button onClick={this.duplicateElements}>Duplicate Selection</Button>
        </Menu.Item>
        {this.props.selectedElements.length === 1 && (
          <Menu.Item>
            <Button onClick={() => this.props.sendToBack(this.props.selectedElements[0])}>
              Send To Back
            </Button>
          </Menu.Item>
        )}
        {this.props.selectedElements.length === 1 && (
          <Menu.Item>
            <Button onClick={() => this.props.bringToFront(this.props.selectedElements[0])}>
              Bring to Front
            </Button>
          </Menu.Item>
        )}
      </Menu.Menu>
    );
  }

  duplicateElements = () => {
    this.props.duplicateElements();
  };
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

const mapState = state => {
  return { selectedElements: state.designer.selectedElements };
};

const mapDispatch = dispatch => {
  return {
    duplicateElements: () => dispatch(designerOperations.duplicateSelectedElements()),
    sendToBack: () => dispatch(designerOperations.sendElementToBack()),
    bringToFront: () => dispatch(designerOperations.bringElementToFront())
  };
};

export default connect(mapState, mapDispatch)(StyledToolbar);
