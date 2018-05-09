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
    this.state = {
      linksStr: [],
      linksModels: []
    };
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
    const links = deserializedData.links;
    let allPorts = [];
    for (let node in nodes) {
      let nodeDetails = nodes[node];
      let nodeToAdd = new SRD.DefaultNodeModel(nodeDetails.title, nodeDetails.color);
      if (nodeDetails.type === "outNode") {
        nodeToAdd = this.addPort(nodeDetails.outPort, nodeToAdd, "outNode");
        if (nodeToAdd) allPorts = allPorts.concat(nodeToAdd.getOutPorts());
      } else {
        nodeToAdd = this.addPort(nodeDetails.inPort, nodeToAdd, "inNode");
        if (nodeToAdd) allPorts = allPorts.concat(nodeToAdd.getInPorts());
      }
      if (nodeToAdd) {
        nodeToAdd.setPosition(nodeDetails.posX, nodeDetails.posY);
        this.addListenersOnNode(nodeToAdd, node);
        this.activeModel.addNode(nodeToAdd);
      }
      this.addLinks(links, allPorts);
    }
  }

  addListenersOnNode(nodeToAdd, node) {
    let self = this;
    nodeToAdd.addListener({
      selectionChanged: function() {
        self.updateNodePosition(nodeToAdd.x, nodeToAdd.y, node);
      },
      entityRemoved: function() {
        self.findNodeToDelete(node);
      }
    });
  }

  addLinks(links, allPorts) {
    for (let link in links) {
      let fromPort = "";
      let toPort = "";
      for (let i = 0; i < allPorts.length; i++) {
        if (allPorts[i].label === links[link].from) {
          fromPort = allPorts[i];
        } else if (allPorts[i].label === links[link].to) {
          toPort = allPorts[i];
        }
      }
      if (fromPort && toPort) {
        const link = fromPort.link(toPort);
        this.activeModel.addLink(link);
      }
    }
  }

  updateNodePosition(posX, posY, nodeId) {
    axios
      .get("/api/schemas")
      .then(result => {
        const deserializedData = JSON.parse(result.data);
        const nodes = deserializedData.nodes;
        let newNodes = {};
        for (let node in nodes) {
          if (node === nodeId) {
            nodes[node].x = posX;
            nodes[node].y = posY;
          }
          newNodes[node] = nodes[node];
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
    const linkModel = this.activeModel.getLinks();
    for (let link in linkModel) {
      const linkDetails = linkModel[link];
      const sourcePortModel = linkDetails.sourcePort;
      const targetPortModel = linkDetails.targetPort;
      if (sourcePortModel && targetPortModel) {
        const sourcePortModelName = sourcePortModel.parent.name;
        const targetPortModelName = targetPortModel.parent.name;
        serializedObject.links[link] = {
          from: sourcePortModel.label,
          to: targetPortModel.label
        };
      }
    }
    const serializedData = JSON.stringify(serializedObject);
    console.log("serialized data", serializedData);
    axios
      .put("/api/schemas/", {
        properties: serializedData
      })
      .then(() => {})
      .catch(err => console.log("err in line 190", err));
  }

  addPort(portArr, nodeToAdd, typePort) {
    if (portArr) {
      for (let i = 0; i < portArr.length; i++) {
        if (typePort === "outNode") {
          nodeToAdd.addOutPort(portArr[i]);
        } else {
          nodeToAdd.addInPort(portArr[i]);
        }
      }
      return nodeToAdd;
    }
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
