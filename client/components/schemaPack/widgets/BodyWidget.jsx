import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";
require("storm-react-diagrams/dist/style.min.css");
import { Button, Header, Input, Modal, Form, Dropdown } from "semantic-ui-react";

export class BodyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inNodeTitle: "DefaultInNode",
      inNodeColor: "rgb(192,255,0)",
      inPorts: [],
      inNodeMade: false,
      openIn: false,
      openOut: false,
      testColor: "#FFFFFF",
      outNodeTitle: "DefaultOutNode",
      outNodeColor: "rgb(0,192, 255)",
      outPorts: [],
      outNodeMade: false
    };
  }

  handleInNodeTitleChange = event => {
    console.log("inside handleNodeTitle");
    this.setState({ inNodeTitle: event.target.value }, () => {});
  };

  cutHex = hexNum => {
    return hexNum.charAt(0) === "#" ? hexNum.substring(1, 7) : hexNum;
  };

  handleInNodeColorChange = event => {
    const red = parseInt(this.cutHex(event.target.value).substring(0, 2), 16);
    const green = parseInt(this.cutHex(event.target.value).substring(2, 4), 16);
    const blue = parseInt(this.cutHex(event.target.value).substring(4, 6), 16);
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    this.setState({ inNodeColor: rgbColor });
  };

  handleOutNodeTitleChange = event => {
    this.setState({ outNodeTitle: event.target.value }, () => {});
  };

  handleOutNodeColorChange = event => {
    const red = parseInt(this.cutHex(event.target.value).substring(0, 2), 16);
    const green = parseInt(this.cutHex(event.target.value).substring(2, 4), 16);
    const blue = parseInt(this.cutHex(event.target.value).substring(4, 6), 16);
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    this.setState({ outNodeColor: event.target.value }, () => {});
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
    this.setState({ inPorts: newPorts, inNodeMade: true, open: false });
    this.closeIn();
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
    this.setState({ outPorts: newPorts, outNodeMade: true, open: false });
    this.closeOut();
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
              trigger={<Button>Add IN Node</Button>}
              closeIcon
              style={{ width: "400px" }}
              open={openIn}
              onOpen={this.openIn}
              onClose={this.closeIn}>
              <Header icon="block layout" content="Let's Make A Node!" />
              <Modal.Content>
                <Form onSubmit={this.inPortsSubmit} style={{ margin: "10px" }}>
                  <Form.Group widths="equal">
                    <Input
                      label="Node Title"
                      onChange={this.handleInNodeTitleChange}
                      name="inNodeTitle"
                      value={this.state.inNodeTitle}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Form.Field>Node Ports</Form.Field>
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
                    return <Input key={portNum} placeholder="Port Name Here" name={`port${portNum}`} />;
                  })}
                  <Form.Group>
                    <Form.Field>Node Color</Form.Field>
                    <Input
                      type="color"
                      onChange={this.handleInNodeColorChange}
                      name="inNodeColor"
                      value={this.state.testColor}
                    />
                  </Form.Group>
                  <Form.Button>Submit</Form.Button>
                </Form>
              </Modal.Content>
            </Modal>
            <br />
            {this.state.inNodeMade ? (
              <TrayItemWidget model={{ type: "in" }} name="DRAG ME OVER!" color="rgb(192,255,0)" />
            ) : null}
            <br />
            <Modal
              trigger={<Button>Add OUT Node</Button>}
              closeIcon
              style={{ width: "400px" }}
              open={openOut}
              onOpen={this.openOut}
              onClose={this.closeOut}>
              <Header icon="block layout" content="Let's Make A Node!" />
              <Modal.Content>
                <Form onSubmit={this.outPortsSubmit} style={{ margin: "10px" }}>
                  <Form.Group widths="equal">
                    <Input
                      label="Node Title"
                      onChange={this.handleOutNodeTitleChange}
                      name="outNodeTitle"
                      value={this.state.outNodeTitle}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Form.Field>Node Ports</Form.Field>
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
                    return <Input key={portNum} placeholder="Port Name Here" name={`port${portNum}`} />;
                  })}
                  <Form.Group>
                    <Form.Field>Node Color</Form.Field>
                    <Input
                      type="color"
                      onChange={this.handleOutNodeColorChange}
                      name="inNodeColor"
                      value={this.state.testColor}
                    />
                  </Form.Group>
                  <Form.Button>Submit</Form.Button>
                </Form>
              </Modal.Content>
            </Modal>
            {this.state.outNodeMade ? (
              <TrayItemWidget model={{ type: "out" }} name="DRAG ME OVER!" color="rgb(0,192,255)" />
            ) : null}
          </TrayWidget>
          <div
            className="diagram-layer"
            onDrop={event => {
              this.onDrop(event);
            }}
            onDragOver={event => {
              event.preventDefault();
            }}>
            <DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
          </div>
        </div>
      </div>
    );
  }

  onDrop(event) {
    const data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
    const nodesCount = _.keys(
      this.props.app
        .getDiagramEngine()
        .getDiagramModel()
        .getNodes()
    ).length;

    let node = null;
    if (data.type === "in") {
      node = new DefaultNodeModel(this.state.inNodeTitle, this.state.inNodeColor);
      this.state.inPorts.map(inPort => {
        node.addInPort(inPort);
      });
      this.setState({ inPorts: [], inNodeTitle: "", inNodeColor: "", inNodeMade: false, openIn: false });
    } else {
      node = new DefaultNodeModel(this.state.outNodeTitle, this.state.outNodeColor);
      this.state.outPorts.map(outPort => {
        node.addOutPort(outPort);
      });
      this.setState({ outPorts: [], outNodeTitle: "", outNodeColor: "", outNodeMade: false, openOut: false });
    }
    const points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
    node.x = points.x;
    node.y = points.y;
    this.props.app
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
    this.props.app.updateSchema();
  }
}
