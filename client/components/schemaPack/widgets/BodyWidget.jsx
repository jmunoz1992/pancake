import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";
require("storm-react-diagrams/dist/style.min.css");
import { Button, Header, Input, Modal, Form, Message, Icon, Divider } from "semantic-ui-react";
import "rc-color-picker/assets/index.css";
import ColorPicker from "rc-color-picker";
import { default as AddLabelPopup } from "../../issues/add-label-tooltip";
import { connect } from "react-redux";
import { default as Toolbar } from "./toolbar";

// react-diagram's DiagramWidget calls a "stopFiringAction" function when the user finishes
// manipulating a diagram element, including after they move an element around.  Because we don't
// otherwise have a proper event listener for node movement, we can hook stopFiringAction

class BodyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeTitle: "",
      nodeColor: "rgb(192,255,0)",
      nodePorts: [],
      linkTitle: "",
      isModalOpen: false,
      linkModalOpen: false,
      nodeTestColor: "rgb(255,255, 255)",
      hideNoTitleWarning: true,
      hideNoLinkTitleWarning: true,
      hideNoPortAmountWarning: true,
      hideNoPortsNamedWarning: true,
      portInputCount: 1,
      labels: [],
      editMode: false,
      existingPorts: []
    };

    this.stormRef = React.createRef();

    // Save DiagramWidget's original, unhooked stopFiringAction if a previous instance of this
    // class did not already do so
    if (!DiagramWidget.prototype.originalStopFiringAction) {
      DiagramWidget.prototype.originalStopFiringAction = DiagramWidget.prototype.stopFiringAction;
    }

    // Update stopFiringAction with our hook so we can react to events for which an official event
    // listener is not provided
    // We need access to both BodyWidget's this context and the internal DiagramWidget this context
    let widgetThis = this;
    DiagramWidget.prototype.stopFiringAction = function(...args) {
      DiagramWidget.prototype.originalStopFiringAction.apply(this, args);
      props.app.serializeSchema();
      widgetThis.forceUpdate();
    };

    // Hook onkeyup to stop it from deleting nodes when we're typing
    if (!DiagramWidget.prototype.originalOnKeyUp) {
      DiagramWidget.prototype.originalOnKeyUp = DiagramWidget.prototype.onKeyUp;
    }
    DiagramWidget.prototype.onKeyUp = function(...args) {
      if (args[0].target === document.getElementsByTagName("body")[0]) {
        DiagramWidget.prototype.originalOnKeyUp.apply(this, args);
        props.app.serializeSchema();
      }
    };
  }

  handleNodeTitleChange = event => {
    this.setState({ nodeTitle: event.target.value });
  };

  handleLinkTitleChange = event => {
    this.setState({ linkTitle: event.target.value });
  };

  cutHex = hexNum => {
    return hexNum.charAt(0) === "#" ? hexNum.substring(1, 7) : hexNum;
  };

  handleNodeColorChange = event => {
    const color = event.color;
    const red = parseInt(this.cutHex(color).substring(0, 2), 16);
    const green = parseInt(this.cutHex(color).substring(2, 4), 16);
    const blue = parseInt(this.cutHex(color).substring(4, 6), 16);
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    this.setState({ nodeColor: rgbColor });
    this.setState({ nodeTestColor: color });
  };

  handlePortSelectChange = event => {
    const numPorts = event.target.value;
    let ports = [];
    for (let i = 1; i <= numPorts; i++) {
      ports.push(i);
    }
    this.setState({ nodePorts: ports });
  };

  onPortInputChange = event => {
    if (event.target.name === `port${this.state.portInputCount - 1}`) {
      this.setState({ portInputCount: this.state.portInputCount + 1 });
      this.forceUpdate();
    }
  };

  linkTitleSubmit = () => {
    if (this.state.linkTitle === "") {
      this.setState({ hideNoLinkTitleWarning: false });
      return;
    } else {
      this.setState({ hideNoLinkTitleWarning: true });
    }
    this.closeModal();
    this.addNodeToCanvas();
  };

  nodePortsSubmit = event => {
    event.preventDefault();
    const { nodeTitle, nodePorts } = this.state;
    if (nodeTitle === "") {
      this.setState({ hideNoTitleWarning: false });
      return;
    } else {
      this.setState({ hideNoTitleWarning: true });
    }

    if (this.state.editMode) {
      this.editExistingNode(event.target);
      return;
    }

    const validPorts = [];
    for (let i = 0; i < this.state.portInputCount; i++) {
      const portName = "port" + i;
      if (event.target[portName] && event.target[portName].value !== "") validPorts.push(event.target[portName].value);
    }
    this.setState({ hideNoPortsNamedWarning: !!validPorts.length });
    if (validPorts.length === 0) return;

    this.setState({ nodePorts: validPorts, open: false });
    this.closeModal();
    this.addNodeToCanvas(validPorts);
  };

  serializeAndUpdateLabels = (event, target) => {
    this.setState({ labels: target.value });
  };

  openModal = () => {
    const selected = this.props.app.activeModel.getNode(this.props.app.selectedNode);
    this.initializeState(true);
    if (selected && Object.keys(selected.ports).length) {
      this.setState({
        editMode: true,
        nodeTitle: selected.name,
        nodeColor: selected.color,
        portInputCount: Object.keys(selected.ports).length / 2 + 1,
        labels: selected.extras.labels,
        existingPorts: Object.values(selected.ports).map(port => port.label)
      });
    }
  };
  closeModal = () => this.setState({ isModalOpen: false });

  linkModalOpen = () => this.setState({ linkModalOpen: true });
  linkCloseIn = () => this.setState({ linkModalOpen: false });

  initializeState = open => {
    this.setState({
      nodeTitle: "",
      nodeColor: "",
      linkTitle: "",
      isModalOpen: !!open,
      linkModalOpen: false,
      nodeTestColor: "rgb(255,255, 255)",
      portInputCount: 1,
      labels: [],
      editMode: false,
      existingPorts: []
    });
  };

  renderPortInputs = () => {
    let inputArray = [];
    for (let i = 0; i < this.state.portInputCount; i++) {
      inputArray.push(
        <Form.Group key={`portInput-${i}`} widths="equal">
          <Form.Field>
            <Input
              fluid
              label={`Field ${i + 1}`}
              onChange={this.onPortInputChange}
              name={`port${i}`}
              defaultValue={this.state.existingPorts[i * 2] ? this.state.existingPorts[i * 2] : ""}
            />
          </Form.Field>
        </Form.Group>
      );
    }
    return inputArray;
  };

  renderModelModal() {
    const { isModalOpen } = this.state;
    const selectedItem = this.props.app.activeModel.getNode(this.props.app.selectedNode);
    const isSelected = selectedItem && Object.keys(selectedItem.ports).length;
    const options = this.props.labels.map(label => ({ key: label.id, text: label.name, value: label.name }));
    return (
      <Modal
        trigger={
          <Button style={{ backgroundColor: "rgb(192,255,0)", color: "#000000" }}>
            {isSelected ? "Edit Model" : "Create New Model"}
          </Button>
        }
        closeIcon
        style={{ width: "400px" }}
        open={isModalOpen}
        onOpen={this.openModal}
        onClose={this.closeModal}>
        <Header
          icon="block layout"
          content={this.state.editMode ? "Edit Selected Model" : "Create New Model"}
        />
        <Modal.Content>
          <Form onSubmit={this.nodePortsSubmit} style={{ margin: "10px" }}>
            <Form.Group widths="equal">
              <Form.Field>
                <Input
                  label="Model Name"
                  onChange={this.handleNodeTitleChange}
                  name="nodeTitle"
                  value={this.state.nodeTitle}
                />
              </Form.Field>
            </Form.Group>
            {this.renderPortInputs()}
            <Form.Group>
              <Form.Dropdown
                label="GitHub Labels:"
                placeholder="Labels"
                fluid
                multiple
                selection
                options={options}
                onChange={this.serializeAndUpdateLabels}
                value={this.state.labels}
                width={13}
              />
              <Form.Field style={{ paddingTop: "23px" }} width={1}>
                <AddLabelPopup />
              </Form.Field>
            </Form.Group>
            <Form.Group>
              <Form.Field>Model Color</Form.Field>
              <ColorPicker
                color={this.state.nodeTestColor}
                onChange={event => this.handleNodeColorChange(event, "inPort")}
                placement="topLeft"
                className="some-class">
                <span className="rc-color-picker-trigger" />
              </ColorPicker>
            </Form.Group>
            <Form.Button>Submit</Form.Button>
          </Form>
          <Message hidden={this.state.hideNoTitleWarning} attached="bottom" warning>
            <Icon name="warning sign" />Model must contain a title
          </Message>
          <Message hidden={this.state.hideNoPortsNamedWarning} attached="bottom" warning>
            <Icon name="warning sign" />Must have at least one field.
          </Message>
        </Modal.Content>
      </Modal>
    );
  }

  renderLinkModal() {
    return (
      <Modal
        trigger={
          <Button style={{ backgroundColor: "rgb(255,255, 255)", color: "#000000" }}>Create Label</Button>
        }
        closeIcon
        open={this.state.linkModalOpen}
        style={{ width: "400px" }}
        onOpen={this.linkModalOpen}
        onClose={this.linkCloseIn}>
        <Modal.Content>
          <Header>Create New Label</Header>
          <Form onSubmit={this.linkTitleSubmit} style={{ margin: "10px" }}>
            <Form.Group widths="equal">
              <Input
                label="Label Content"
                onChange={this.handleLinkTitleChange}
                name="linkTitle"
                value={this.state.linkTitle}
              />
            </Form.Group>
            <Form.Button>Submit</Form.Button>
          </Form>
          <Message hidden={this.state.hideNoLinkTitleWarning} attached="bottom" warning>
            <Icon name="warning sign" />Label must contain a title
          </Message>
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    const { isModalOpen } = this.state;
    const options = this.props.labels.map(label => ({ key: label.id, text: label.name, value: label.name }));
    return (
      <div className="body">
        <div className="content">
          <div className="diagram-layer">
            <DiagramWidget
              ref={this.stormRef}
              maxNumberPointsPerLink={0}
              className="srd-demo-canvas"
              diagramEngine={this.props.app.getDiagramEngine()}
            />
            <Toolbar createModel={this.renderModelModal()} createLabel={this.renderLinkModal()} />
          </div>
        </div>
      </div>
    );
  }

  editExistingNode(formObj) {
    let node = this.props.app.activeModel.getNode(this.props.app.selectedNode);
    node.name = this.state.nodeTitle;
    node.extras.labels = this.state.labels;

    const keys = Object.keys(node.ports);

    for (let i = 0; i < this.state.portInputCount; i++) {
      const existingPort = node.ports[keys[i * 2]];
      const portInputValue = formObj[`port${i}`] && formObj[`port${i}`].value;
      if (existingPort) {
        existingPort.label = portInputValue;
      } else if (portInputValue) {
        node.addInPort(portInputValue);
        node.addOutPort(" ");
      }
    }

    this.props.app.serializeSchema();
    this.closeModal();
    this.forceUpdate();
  }

  addNodeToCanvas(newPorts) {
    let node = null;
    if (newPorts) {
      node = new DefaultNodeModel(this.state.nodeTitle, this.state.nodeColor);
      newPorts.map(inPort => {
        node.addInPort(inPort);
        node.addOutPort(" ");
      });
    } else {
      node = new DefaultNodeModel(this.state.linkTitle, this.state.nodeTestColor);
    }
    node.x = 150;
    node.y = 150;
    node.extras.labels = this.state.labels;
    this.initializeState(false);
    this.props.app.addListenersOnNode(node);
    this.props.app
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
    this.props.app.serializeSchema();
  }
}

const mapState = state => {
  return { labels: state.labels };
};

export default connect(mapState, null, null, { withRef: true })(BodyWidget);
