import * as SRD from "storm-react-diagrams";
import { sendSchemaUpdate } from "../../socket/schema";
import store from "../../store";
import { setIssueFilter } from "../../store/issues";

export class Application {
  constructor(json) {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.activeLinkModel = new SRD.DefaultLinkModel();
    this.activeModel = new SRD.DiagramModel();
    this.loadDiagram(json);
    this.state = {
      linksStr: [],
      linksModels: []
    };
  }

  loadDiagram(json) {
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
      nodeToAdd = this.addPort(nodeDetails, nodeToAdd);
      if (nodeToAdd) {
        allPorts = allPorts.concat(nodeToAdd.getInPorts()).concat(nodeToAdd.getOutPorts());
      }
      console.log("updated node in deserializer thus far", nodeToAdd);
      console.log("all ports thus far in deserializer ", allPorts);
      if (nodeToAdd) {
        nodeToAdd.setPosition(nodeDetails.posX, nodeDetails.posY);
        this.addListenersOnNode(nodeToAdd, node);
        this.activeModel.addNode(nodeToAdd);
      }
      this.addLinks(links, allPorts);
    }
    console.log("active model result in deserializer ", this.activeModel);
  }

  addPort(curNode, updatedNode) {
    const ports = curNode.ports;
    for (let i = 0; i < ports.length; i++) {
      if (ports[i].label.length > 1) {
        updatedNode.addInPort(ports[i].label);
      } else {
        updatedNode.addOutPort(" ");
      }
    }
    return updatedNode;
  }

  addListenersOnNode(nodeToAdd) {
    nodeToAdd.addListener({
      selectionChanged: () => {
        setTimeout(this.updateSchema.bind(this), 0);
        store.dispatch(setIssueFilter(nodeToAdd.name));
      },
      entityRemoved: () => {
        setTimeout(this.updateSchema.bind(this), 0);
      }
    });
  }

  addLinks(links, allPorts) {
    for (let link in links) {
      if (links.hasOwnProperty(link)) {
        let fromPort = "";
        let toPort = "";
        for (let i = 0; i < allPorts.length; i++) {
          const port = allPorts[i];
          if (port.label === links[link].target.label) {
            toPort = port;
          }
          if (port.in === false && port.parent.name === links[link].sourceParentName) {
            fromPort = port;
          }
        }
        console.log("sourcename ", links[link].sourceParentName);
        console.log("from port ", fromPort);
        console.log("to port ", toPort);
        if (fromPort && toPort) {
          const linkForModel = fromPort.link(toPort);
          this.activeModel.addLink(linkForModel);
        }
      }
    }
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
        portsPushed.push(portDetails.serialize());
        serializedObject.nodes[id].ports = portsPushed;
      }
    }
    console.log("serialzied object in updatePorts ", serializedObject);
    return serializedObject;
  }

  updateLinks(linkModel, serializedObject) {
    for (let link in linkModel) {
      if (linkModel.hasOwnProperty(link)) {
        console.log("link model ", linkModel[link]);
        const sourcePortModel = linkModel[link].sourcePort;
        const targetPortModel = linkModel[link].targetPort;
        console.log("source port ", sourcePortModel);
        console.log("target port ", targetPortModel);
        serializedObject.links[link] = {
          source: sourcePortModel.serialize(),
          target: targetPortModel.serialize(),
          sourceParentName: sourcePortModel.parent.name
        };
      }
    }
    return serializedObject;
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
