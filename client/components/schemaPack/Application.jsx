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
import store from "../../store";
import { setIssueFilter } from "../../store/issues";
import { connect } from "react-redux";

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
    console.log("active model result in deserializer ", this.activeModel);
  }

  addListenersOnNode(nodeToAdd) {
    console.log("name in node to add in addListenersOnNode", nodeToAdd.name);
    nodeToAdd.addListener({
      selectionChanged: () => {
        console.log("i am in the add listener");
        setTimeout(this.updateSchema.bind(this), 0);
        store.dispatch(setIssueFilter(nodeToAdd.name));
      },
      entityRemoved: () => {
        setTimeout(this.updateSchema.bind(this), 0);
      }
    });
  }

  addLinks(links, allPorts) {
    console.log("i am in addLinks", links);
    for (let link in links) {
      if (links.hasOwnProperty(link)) {
        let fromPort = "";
        let toPort = "";
        for (let i = 0; i < allPorts.length; i++) {
          if (allPorts[i].label === links[link].from) {
            fromPort = allPorts[i];
          } else if (allPorts[i].label === links[link].to) {
            toPort = allPorts[i];
          }
        }
        console.log("fromPort", fromPort, "toPort", toPort);
        if (fromPort && toPort) {
          const linkForModel = fromPort.link(toPort);
          this.activeModel.addLink(linkForModel);
          console.log("making link for active model in add Links ", this.activeModel);
        }
      }
    }
    console.log("resulting active model in add links ", this.activeModel);
  }

  updateSchema() {
    const allNodes = this.activeModel.getNodes();
    let serializedObject = {
      nodes: {},
      links: {}
    };
    for (let node in allNodes) {
      if (allNodes.hasOwnProperty(node)) {
        const id = allNodes[node].id;
        serializedObject.nodes[id] = {
          title: allNodes[node].name,
          color: allNodes[node].color,
          posX: allNodes[node].x,
          posY: allNodes[node].y
        };
        serializedObject = this.updatePorts(allNodes[node].ports, serializedObject, id);
      }
    }
    serializedObject = this.updateLinks(this.activeModel.getLinks(), serializedObject);
    console.log("serialized object in deserializer", serializedObject);
    const serializedData = JSON.stringify(serializedObject);
    sendSchemaUpdate(serializedData);
  }

  updatePorts(ports, serializedObject, id) {
    const portsPushed = [];
    for (let port in ports) {
      if (ports.hasOwnProperty(port)) {
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
    return serializedObject;
  }

  updateLinks(linkModel, serializedObject) {
    console.log("i am in update links ", linkModel);
    for (let link in linkModel) {
      if (linkModel.hasOwnProperty(link)) {
        const linkDetails = linkModel[link];
        const sourcePortModel = linkDetails.sourcePort;
        const targetPortModel = linkDetails.targetPort;
        if (sourcePortModel && targetPortModel) {
          serializedObject.links[link] = {
            from: sourcePortModel.label,
            to: targetPortModel.label
          };
        }
      }
    }
    return serializedObject;
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
