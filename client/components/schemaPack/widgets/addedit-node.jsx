import React, { Component } from "react";
import { Modal, Button, Header, Form, Input, Message, Icon } from "semantic-ui-react";
import ColorPicker from "rc-color-picker";

class AddEditNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { isModalOpen } = this.state;

    return (
      <Modal
        trigger={<Button style={{ backgroundColor: "rgb(192,255,0)", color: "#000000" }}>Add A Model</Button>}
        closeIcon
        style={{ width: "400px" }}
        open={isModalOpen}
        onOpen={this.isModalOpen}
        onClose={this.closeIn}>
        <Header icon="block layout" content="Let's Make A Model!" />
        <Modal.Content>
          <Form onSubmit={this.nodePortsSubmit} style={{ margin: "10px" }}>
            <Form.Group widths="equal">
              <Input
                label="Model Title"
                onChange={this.handleNodeTitleChange}
                name="nodeTitle"
                value={this.state.nodeTitle}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Field>Model Fields</Form.Field>
              <Form.Field control="select" onChange={event => this.handlePortSelectChange(event, "inPort")}>
                <option value="" />
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </Form.Field>
            </Form.Group>
            {this.state.nodePorts.map(portNum => {
              return <Input key={portNum} placeholder="Field Name Here" name={`port${portNum}`} />;
            })}
            <Form.Group>
              <Form.Field>Model Color</Form.Field>
              <ColorPicker
                color={this.state.nodeTestColor}
                alpha={30}
                onChange={event => this.handleNodeColorChange(event, "inPort")}
                placement="topLeft"
                className="some-class">
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </Form.Group>
            <Form.Button>Submit</Form.Button>
          </Form>
          <Message hidden={this.state.hideNoTitleWarning} attached="bottom" warning>
            <Icon name="warning sign" />Model must contain a Title
          </Message>
          <Message hidden={this.state.hideNoPortAmountWarning} attached="bottom" warning>
            <Icon name="warning sign" />Must pick a number of fields.
          </Message>
          <Message hidden={this.state.hideNoPortsNamedWarning} attached="bottom" warning>
            <Icon name="warning sign" />Must have names for all fields.
          </Message>
        </Modal.Content>
      </Modal>
    );
  }
}

export default AddEditNode;
