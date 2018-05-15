import React, { Component } from "react";
import { Popup, Button, Form, Icon } from "semantic-ui-react";
import ColorPicker from "rc-color-picker";
import { connect } from "react-redux";
import { createNewLabel } from "../../store";

class AddLabelPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labelName: "",
      labelColor: "#ffffff",
      open: false
    };
  }

  onLabelNameChange = ({ target }) => this.setState({ labelName: target.value });
  onColorChange = ({ color }) => this.setState({ labelColor: color });
  onCloseEvent = event => {
    if (event.target.className.includes("rc-color-picker")) {
      console.log("preventing");
      return event.preventDefault();
    }
    this.setState({ open: false });
  };
  addNewLabel = () => {
    if (this.state.labelName && this.state.labelColor) {
      const color = this.state.labelColor.slice(1);
      this.props.createNewLabel(this.state.labelName, color);
      this.setState({ open: false });
    }
  };

  onOpenEvent = _ => this.setState({ open: true });
  render() {
    return (
      <Popup
        style={{ zIndex: 50 }}
        trigger={
          <Button icon color="green">
            <Icon name="add" />
          </Button>
        }
        on="click"
        onOpen={this.onOpenEvent}
        onClose={this.onCloseEvent}
        position="left center"
        open={this.state.open}>
        <div>
          <Form>
            <Form.Input
              label="Label Name"
              placeholder="Label Name"
              value={this.state.labelName}
              onChange={this.onLabelNameChange}
            />
            <Form.Group>
              <Form.Field>Label Color</Form.Field>
              <ColorPicker
                color={this.state.labelColor}
                onChange={this.onColorChange}
                placement="topLeft"
                style={{ zIndex: 100 }}
                className="some-class">
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </Form.Group>
            <Button fluid positive onClick={this.addNewLabel}>
              Create Label
            </Button>
          </Form>
        </div>
      </Popup>
    );
  }
}

export default connect(null, { createNewLabel })(AddLabelPopup);
