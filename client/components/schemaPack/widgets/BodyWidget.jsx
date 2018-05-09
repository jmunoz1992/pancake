import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { Application } from "../Application";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";
require("storm-react-diagrams/dist/style.min.css");
import axios from "axios";

export class BodyWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inNodeTitle: "DefaultInNode",
      inNodeColor: "rgb(192,255,0)",
      inPorts: [],
      outNodeTitle: "DefaultOutNode",
      outNodeColor: "rgb(0,192, 255)",
      outPorts: []
    };
  }

  handleInNodeTitleChange = event => {
    this.setState({ inNodeTitle: event.target.value }, () => {});
  };

  handleInNodeColorChange = event => {
    this.setState({ inNodeColor: event.target.value }, () => {});
  };

  handleOutNodeTitleChange = event => {
    this.setState({ outNodeTitle: event.target.value }, () => {});
  };

  handleOutNodeColorChange = event => {
    this.setState({ outNodeColor: event.target.value }, () => {});
  };

  handlePortSelectChange = (event, typeOfPort) => {
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
    this.setState({ inPorts: newPorts });
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
    this.setState({ outPorts: newPorts });
  };

  render() {
    return (
      <div className="body">
        <div className="header">
          <div className="inNodeTitle">Build your schema below!</div>
        </div>
        <div className="content">
          <TrayWidget>
            <form onSubmit={this.inPortsSubmit} style={{ margin: "10px" }}>
              <p style={{ color: "white", marginTop: "10px" }}>
                Fill out the below form, submit, then drag the 'In Node' box onto the canvas
              </p>
              <label style={{ color: "white" }}>In Node Title: </label>
              <br />
              <input
                onChange={this.handleInNodeTitleChange}
                name="inNodeTitle"
                value={this.state.inNodeTitle}
              />
              <br />
              <br />
              <label style={{ color: "white" }}>Amount of Ports: </label>
              <select onChange={event => this.handlePortSelectChange(event, "inPort")}>
                <option value="" />
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <br />
              <br />
              {this.state.inPorts.map(portNum => {
                return (
                  <div key={portNum}>
                    <label style={{ color: "white" }}>In Node Port Name: </label>
                    <br />
                    <input name={`port${portNum}`} />
                    <br />
                    <br />
                  </div>
                );
              })}
              <label style={{ color: "white" }}>{"In Node Color (format must be rgb())"} </label>
              <br />
              <input
                onChange={this.handleInNodeColorChange}
                name="inNodeColor"
                value={this.state.inNodeColor}
              />
              <br />
              <br />
              <input type="submit" />
            </form>
            <TrayItemWidget model={{ type: "in" }} name="In Node" color="rgb(192,255,0)" />
            <br />
            <form onSubmit={this.outPortsSubmit} style={{ margin: "10px" }}>
              <p style={{ color: "white", marginTop: "10px" }}>
                Fill out the below form, submit, then drag the 'Out Node' box onto the canvas
              </p>
              <label style={{ color: "white" }}>Out Node Title: </label>
              <br />
              <input
                onChange={this.handleOutNodeTitleChange}
                name="outNodeTitle"
                value={this.state.outNodeTitle}
              />
              <br />
              <br />
              <label style={{ color: "white" }}>Amount of Ports: </label>
              <select onChange={event => this.handlePortSelectChange(event, "outPort")}>
                <option value="" />
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <br />
              <br />
              {this.state.outPorts.map(portNum => {
                return (
                  <div key={portNum}>
                    <label style={{ color: "white" }}>Out Node Port Name: </label>
                    <br />
                    <input name={`port${portNum}`} />
                    <br />
                    <br />
                  </div>
                );
              })}
              <br />
              <label style={{ color: "white" }}>{"Out Node Color (format must be rgb())"} </label>
              <br />
              <input
                onChange={this.handleOutNodeColorChange}
                name="outNodeColor"
                value={this.state.outNodeColor}
              />
              <br />
              <br />
              <input type="submit" />
            </form>
            <TrayItemWidget model={{ type: "out" }} name="Out Node" color="rgb(0,192,255)" />
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
      this.setState({ inPorts: [], inNodeTitle: "", inNodeColor: "" });
    } else {
      node = new DefaultNodeModel(this.state.outNodeTitle, this.state.outNodeColor);
      this.state.outPorts.map(outPort => {
        node.addOutPort(outPort);
      });
      this.setState({ outPorts: [], outNodeTitle: "", outNodeColor: "" });
    }
    const points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
    node.x = points.x;
    node.y = points.y;
    this.props.app
      .getDiagramEngine()
      .getDiagramModel()
      .addNode(node);
    this.forceUpdate();
    this.updateSchema();
  }

  updateSchema() {
    const allNodes = this.props.app.activeModel.getNodes();
    let serializedObject = {
      nodes: {},
      links: {}
    };
    for (let node in allNodes) {
      const id = allNodes[node].id;
      serializedObject.nodes[id] = {
        title: allNodes[node].name,
        color: allNodes[node].color,
        posX: allNodes[node].x,
        posY: allNodes[node].y
      };
      serializedObject = this.updatePorts(node, allNodes, serializedObject, id);
    }
    const linkModel = this.props.app.activeModel.getLinks();
    for (let link in linkModel) {
      const linkDetails = linkModel[link];
      const sourcePortModel = linkDetails.sourcePort;
      const targetPortModel = linkDetails.targetPort;
      serializedObject.links[link] = {
        from: sourcePortModel.label,
        to: targetPortModel.label
      };
    }
    console.log("serialized obj ", serializedObject);
    if (Object.keys(serializedObject).length) {
      this.putRequest(serializedObject);
    }
  }

  updatePorts(node, allNodes, serializedObject, id) {
    const ports = allNodes[node].ports;
    const portsPushed = [];
    for (let port in ports) {
      const portDetails = ports[port];
      if (portDetails.in) {
        serializedObject.nodes[id].type = "inNode";
        serializedObject.nodes[id].inPort = portsPushed;
      } else {
        serializedObject.nodes[id].type = "outNode";
        serializedObject.nodes[id].outPort = portsPushed;
      }
      portsPushed.push(portDetails.label);
    }
    return serializedObject;
  }

  putRequest(serializedObject) {
    const serializedData = JSON.stringify(serializedObject);
    axios
      .put("/api/schemas/", {
        properties: serializedData
      })
      .then(result => {
        if (!result.data.length) {
          axios
            .post("/api/schemas/", {
              properties: serializedData
            })
            .then(() => {})
            .catch(err => console.log("err ", err));
        }
      })
      .catch(err => console.log("err ", err));
  }
}
