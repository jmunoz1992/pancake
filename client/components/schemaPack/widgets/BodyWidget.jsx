import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";
require("storm-react-diagrams/dist/style.min.css");
import { Button, Header, Input, Modal, Form, Dropdown } from "semantic-ui-react";
import "rc-color-picker/assets/index.css";
import ColorPicker from "rc-color-picker";

export class BodyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inNodeTitle: "Default Model Title",
      inNodeColor: "rgb(192,255,0)",
      inPorts: [],
      openIn: false,
      openOut: false,
      testInColor: "#ff0000",
      testOutColor: "#ff0000",
      outNodeTitle: "Default Model Title",
      outNodeColor: "rgb(0,192, 255)",
      outPorts: []
    };
  }

  handleInNodeTitleChange = event => {
    console.log("inside handleNodeTitle");
    this.setState({ inNodeTitle: event.target.value });
  };

  cutHex = hexNum => {
    return hexNum.charAt(0) === "#" ? hexNum.substring(1, 7) : hexNum;
  };

  handleNodeColorChange = (event, typeOfPort) => {
    const color = event.color;
    this.setState({ testInColor: color });
    const red = parseInt(this.cutHex(color).substring(0, 2), 16);
    const green = parseInt(this.cutHex(color).substring(2, 4), 16);
    const blue = parseInt(this.cutHex(color).substring(4, 6), 16);
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    if (typeOfPort === "inPort") {
      this.setState({ inNodeColor: rgbColor });
      this.setState({ testInColor: color });
    } else {
      this.setState({ outNodeColor: rgbColor });
      this.setState({ testOutColor: color });
    }
  };

  handleOutNodeTitleChange = event => {
    this.setState({ outNodeTitle: event.target.value });
  };

  handlePortSelectChange = (event, typeOfPort) => {
    console.log("event in handlePortSelectChange", event.target);
    const numPorts = event.target.value;
    let ports = [];
    for (let i = 1; i <= numPorts; i++) {
      ports.push(i);
    }
    if (typeOfPort === "inPort") {
      this.setState({ inPorts: ports });
    } else {
      this.setState({ outPorts: ports });
    }
  };

  inPortsSubmit = event => {
    console.log("inside inPortsSubmit");
    event.preventDefault();
    if (
      !this.state.inNodeTitle ||
      !this.state.inNodeColor ||
      this.state.inPorts.length === 0
      // !this.state.inPorts.every(port => typeof port === "string")
    ) {
      alert("PLEASE FILL IN ALL THE FORM FIELDS!");
    }
    let newPorts = [];
    for (let i = 1; i <= this.state.inPorts.length; i++) {
      const portName = "port" + i;
      if (!event.target[portName]) {
        alert("PLEASE FILL IN ALL IN PORT NAME BOXES");
      } else {
        newPorts.push(event.target[portName].value);
      }
    }
    this.setState({ inPorts: newPorts, open: false });
    this.closeIn();
    this.addNodeToCanvas("inPort");
  };

  outPortsSubmit = event => {
    event.preventDefault();
    if (
      !this.state.outNodeTitle ||
      !this.state.outNodeColor ||
      this.state.outPorts.length === 0
      // !this.state.outPorts.every(port => typeof port === "string")
    ) {
      alert("PLEASE FILL IN ALL THE FORM FIELDS!");
    }
    let newPorts = [];
    for (let i = 1; i <= this.state.outPorts.length; i++) {
      const portName = "port" + i;
      if (!event.target[portName]) {
        alert("PLEASE FILL IN ALL OUT PORT NAME BOXES");
      } else {
        newPorts.push(event.target[portName].value);
      }
    }
    this.setState({ outPorts: newPorts, open: false });
    this.closeOut();
    this.addNodeToCanvas("outPort");
  };

  openIn = () => this.setState({ openIn: true });
  closeIn = () => this.setState({ openIn: false });

  openOut = () => this.setState({ openOut: true });
  closeOut = () => this.setState({ openOut: false });

  render() {
    console.log("inNodeMade", this.state.inNodeMade);
    const { openIn, openOut } = this.state;
    return (
      <div className="body">
        <div className="content">
          <TrayWidget>
            <br />
            <Modal
              trigger={
                <Button style={{ backgroundColor: "rgb(192,255,0)", color: "#000000" }}>Add IN Model</Button>
              }
              closeIcon
              style={{ width: "400px" }}
              open={openIn}
              onOpen={this.openIn}
              onClose={this.closeIn}>
              <Header icon="block layout" content="Let's Make A Model!" />
              <Modal.Content>
                <Form onSubmit={this.inPortsSubmit} style={{ margin: "10px" }}>
                  <Form.Group widths="equal">
                    <Input
                      label="Model Title"
                      onChange={this.handleInNodeTitleChange}
                      name="inNodeTitle"
                      value={this.state.inNodeTitle}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Form.Field>Model Fields</Form.Field>
                    <Form.Field
                      control="select"
                      onChange={event => this.handlePortSelectChange(event, "inPort")}>
                      <option value="" />
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Field>
                  </Form.Group>
                  {this.state.inPorts.map(portNum => {
                    return <Input key={portNum} placeholder="Field Name Here" name={`port${portNum}`} />;
                  })}
                  <Form.Group>
                    <Form.Field>Model Color</Form.Field>
                    <ColorPicker
                      color={this.state.testInColor}
                      alpha={30}
                      onChange={event => this.handleNodeColorChange(event, "inPort")}
                      placement="topLeft"
                      className="some-class">
                      <span className="rc-color-picker-trigger" />
                    </ColorPicker>
                  </Form.Group>
                  <Form.Button>Submit</Form.Button>
                </Form>
              </Modal.Content>
            </Modal>
            <br />
            <br />
            <Modal
              trigger={
                <Button style={{ backgroundColor: "rgb(0,192,255)", color: "#000000" }}>Add OUT Model</Button>
              }
              closeIcon
              style={{ width: "400px" }}
              open={openOut}
              onOpen={this.openOut}
              onClose={this.closeOut}>
              <Header icon="block layout" content="Let's Make A Model!" />
              <Modal.Content>
                <Form onSubmit={this.outPortsSubmit} style={{ margin: "10px" }}>
                  <Form.Group widths="equal">
                    <Input
                      label="Model Title"
                      onChange={this.handleOutNodeTitleChange}
                      name="outNodeTitle"
                      value={this.state.outNodeTitle}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Form.Field>Model Fields</Form.Field>
                    <Form.Field
                      control="select"
                      onChange={event => this.handlePortSelectChange(event, "outPort")}>
                      <option value="" />
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </Form.Field>
                  </Form.Group>
                  {this.state.outPorts.map(portNum => {
                    return <Input key={portNum} placeholder="Field Name Here" name={`port${portNum}`} />;
                  })}
                  <Form.Group>
                    <Form.Field>Model Color</Form.Field>
                    <ColorPicker
                      color={this.state.testInColor}
                      alpha={30}
                      onChange={event => this.handleNodeColorChange(event, "outPort")}
                      placement="topLeft"
                      className="some-class">
                      <span className="rc-color-picker-trigger" />
                    </ColorPicker>
                  </Form.Group>
                  <Form.Button>Submit</Form.Button>
                </Form>
              </Modal.Content>
            </Modal>
          </TrayWidget>
          <div className="diagram-layer">
            <DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
          </div>
        </div>
      </div>
    );
  }

  addNodeToCanvas(typeOfPort) {
    let node = null;
    if (typeOfPort === "inPort") {
      node = new DefaultNodeModel(this.state.inNodeTitle, this.state.inNodeColor);
      this.state.inPorts.map(inPort => {
        node.addInPort(inPort);
      });
      this.setState({
        inPorts: [],
        inNodeTitle: "",
        inNodeColor: "",
        openIn: false,
        testInColor: "#ff0000"
      });
    } else {
      node = new DefaultNodeModel(this.state.outNodeTitle, this.state.outNodeColor);
      this.state.outPorts.map(outPort => {
        node.addOutPort(outPort);
      });
      this.setState({
        outPorts: [],
        outNodeTitle: "",
        outNodeColor: "",
        openOut: false,
        testOutColor: "#ff0000"
      });
    }
    this.props.app
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
    this.props.app.updateSchema();
  }
}
