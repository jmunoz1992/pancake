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
      title: "",
      portName: "",
      nodeColor: ""
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state.title);
    console.log(this.state.portName);
    console.log(this.state.nodeColor);
  };

  handleTitleChange = event => {
    this.setState({ title: event.target.value }, () => {});
  };

  handlePortNameChange = event => {
    this.setState({ portName: event.target.value }, () => {});
  };

  handleNodeColorChange = event => {
    this.setState({ nodeColor: event.target.value }, () => {});
  };

  render() {
    return (
      <div className="body">
        <div className="header">
          <div className="title">Build your schema below!</div>
        </div>
        <div className="content">
          <TrayWidget>
            <TrayItemWidget model={{ type: "in" }} name="In Node" color="rgb(192,255,0)" />
            <form
              onSubmit={event => {
                this.handleSubmit(event);
              }}>
              <label style={{ color: "white" }}>In Node Title: </label>
              <br />
              <input onChange={this.handleTitleChange} name="title" value={this.state.title} />
              <br />
              <label style={{ color: "white" }}>In Node Port Name: </label>
              <br />
              <input onChange={this.handlePortNameChange} name="portName" value={this.state.portName} />
              <br />
              <label style={{ color: "white" }}>{"Node Color (format must be rgb())"} </label>
              <br />
              <input onChange={this.handleNodeColorChange} name="nodeColor" value={this.state.nodeColor} />
              <br />
              <br />
              <input type="submit" value="Submit" />
            </form>
            <TrayItemWidget model={{ type: "out" }} name="Out Node" color="rgb(0,192,255)" />
          </TrayWidget>
          <div
            className="diagram-layer"
            onDrop={event => {
              const data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
              const nodesCount = _.keys(
                this.props.app
                  .getDiagramEngine()
                  .getDiagramModel()
                  .getNodes()
              ).length;

              let node = null;
              if (data.type === "in") {
                node = new DefaultNodeModel(this.state.title, this.state.nodeColor);
                node.addInPort(this.state.portName);
              } else {
                node = new DefaultNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
                node.addOutPort("Out");
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

  updateSchema() {
    const allNodes = this.props.app.activeModel.getNodes();
    let serializedObject = {
      nodes: {}
    };
    for (let node in allNodes) {
      const id = allNodes[node].id;
      serializedObject.nodes[id] = {
        title: allNodes[node].name,
        color: allNodes[node].color,
        posX: allNodes[node].x,
        posY: allNodes[node].y
      };
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
    }
    if (Object.keys(serializedObject).length > 0) {
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
}
