import * as SRD from "storm-react-diagrams";
import { sendSchemaUpdate } from "../../socket/schema";
import store from "../../store";
import { setIssueFilter } from "../../store/issues";

export class Application {
  constructor(json) {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.loadDiagram(json);
    this.state = {
      linksStr: [],
      linksModels: []
    };
  }

  loadDiagram(json) {
    this.activeModel = new SRD.DiagramModel();
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
      nodeToAdd = this.addPort(nodeDetails.outPort, nodeToAdd);
      if (nodeToAdd) {
        allPorts = allPorts.concat(nodeToAdd.getInPorts()).concat(nodeToAdd.getOutPorts());
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

  addPort(portArr, nodeToAdd) {
    if (portArr) {
      for (let i = 0; i < portArr.length; i += 2) {
        nodeToAdd.addInPort(portArr[i]);
        nodeToAdd.addOutPort(" ");
      }
      return nodeToAdd;
    }
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
        // let fromPort = "";
        // let toPort = "";
        // for (let i = 0; i < allPorts.length; i++) {
        //   if (allPorts[i].parent.name === links[link].from) {
        //     console.log("inside matching parent names ", allPorts[i]);
        //   }
        //   if (allPorts[i].label === links[link].to) {
        //     toPort = allPorts[i];
        //   }
        // }
        // console.log("fromPort", fromPort, "toPort", toPort);
        // if (fromPort && toPort) {
        //   const linkForModel = fromPort.link(toPort);
        //   this.activeModel.addLink(linkForModel);
        //   console.log("making link for active model in add Links ", this.activeModel);
        // }
        // const linkModelDeserialized = deSerialize(links[link], this.diagramEngine);
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
    for (let link in linkModel) {
      if (linkModel.hasOwnProperty(link)) {
        const serializedLinkModel = linkModel[link].serialize();
        serializedObject.links[link] = serializedLinkModel;
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
