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
import { sendSchemaUpdate } from "../../socket/schema";
// import { action } from "@storybook/addon-actions";

export class Application {
  constructor(json) {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.addListener({ repaintCanvas: () => console.log("repaint") });
    this.diagramEngine.installDefaultFactories();
    this.loadDiagram(json);
    this.state = {
      linksStr: [],
      linksModels: []
    };
  }

  loadDiagram(json) {
    this.activeModel = new SRD.DiagramModel();
    this.activeModel.addListener({ nodesUpdated: (...args) => console.log("nodesUpdated", args) });
    this.json = json;
    this.diagramEngine.setDiagramModel(this.activeModel);
    if (json) this.deserializer(json);
  }

  deserializer(data) {
    console.log("deserializer", data);
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
      // debugger; //eslint-disable-line
      if (nodeToAdd) {
        nodeToAdd.setPosition(nodeDetails.posX, nodeDetails.posY);
        this.addListenersOnNode(nodeToAdd, node);
        this.activeModel.addNode(nodeToAdd);
      }
      console.log("Deserializer: activeModel", this.activeModel);
      this.addLinks(links, allPorts);
    }
  }

  addListenersOnNode(nodeToAdd, node) {
    nodeToAdd.addListener({
      selectionChanged: () => {
        console.log("selectionChanged");
        setTimeout(this.updateSchema.bind(this), 0);
      },
      entityRemoved: () => {
        setTimeout(this.updateSchema.bind(this), 0);
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

  updateSchema() {
    console.log("updateSchema");
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
    sendSchemaUpdate(serializedData);
    // axios
    //   .put("/api/schemas/", {
    //     properties: serializedData
    //   })
    //   .then(() => {})
    //   .catch(err => console.log("err in line 190", err));
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
