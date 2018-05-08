import * as SRD from "storm-react-diagrams";
import {
  DiagramEngine,
  DiagramModel,
  DiagramProps,
  DefaultNodeModel,
  LinkModel,
  DiagramWidget
} from "storm-react-diagrams";
import axios from "axios";
// import { action } from "@storybook/addon-actions";

export class Application {
  constructor() {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.fetchModels();
  }

  fetchModels() {
    this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);
    axios
      .get("/api/schemas")
      .then(result => {
        if (result) {
          this.deserializer(result.data);
        }
      })
      .catch(err => console.log(err));
  }

  deserializer(data) {
    const deserializedData = JSON.parse(data);
    const nodes = deserializedData.nodes;
    let nodeModels = [];

    for (let node in nodes) {
      let nodeDetails = nodes[node];
      let nodeToAdd = new SRD.DefaultNodeModel(nodeDetails.title, nodeDetails.color);
      if (nodeDetails.type === "outNode") {
        nodeToAdd = this.addPort(nodeDetails.outPort, nodeToAdd, "outNode");
      } else {
        nodeToAdd = this.addPort(nodeDetails.inPort, nodeToAdd, "inNode");
      }
      nodeToAdd.setPosition(nodeDetails.posX, nodeDetails.posY);
      let self = this;
      nodeToAdd.addListener({
        selectionChanged: function() {
          console.log("I GOT CLICKED!");
          console.log("x: ", nodeToAdd.x);
          console.log("x: ", nodeToAdd.y);
        },
        entityRemoved: function() {
          self.findNodeToDelete(node);
        }
      });
      nodeModels.push(nodeToAdd);
      this.activeModel.addNode(nodeToAdd);
    }
  }

  findNodeToDelete(nodeId) {
    axios
      .get("/api/schemas")
      .then(result => {
        const deserializedData = JSON.parse(result.data);
        const nodes = deserializedData.nodes;
        let newNodes = {};
        for (let node in nodes) {
          if (node !== nodeId) {
            newNodes[node] = nodes[node];
          }
        }
        const serializedData = JSON.stringify(newNodes);
        axios
          .put("/api/schemas/", {
            properties: serializedData
          })
          .then(() => {
            this.updateSchema();
          })
          .catch(err => console.log("err ", err));
      })
      .catch(err => console.log(err));
  }

  updateSchema() {
    const allNodes = this.activeModel.getNodes();
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
    const serializedData = JSON.stringify(serializedObject);
    axios
      .put("/api/schemas/", {
        properties: serializedData
      })
      .then(() => {})
      .catch(err => console.log("err ", err));
  }

  addPort(portArr, nodeToAdd, typePort) {
    for (let i = 0; i < portArr.length; i++) {
      if (typePort === "outNode") {
        nodeToAdd.addOutPort(portArr[i]);
      } else {
        nodeToAdd.addInPort(portArr[i]);
      }
    }
    return nodeToAdd;
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
