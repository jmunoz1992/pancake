import * as SRD from "storm-react-diagrams";
import { sendSchemaUpdate } from "../../socket/schema";
import store from "../../store";
import { setIssueFilter } from "../../store/issues";

export class Application {
  constructor(json) {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.activeModel = new SRD.DiagramModel();
    this.loadDiagram(json);
    this.ports = [];
  }

  loadDiagram(json) {
    this.json = json;
    this.diagramEngine.setDiagramModel(this.activeModel);
    if (json) this.deserializer(json);
  }

  deserializer(data) {
    const deserializedData = JSON.parse(data);
    this.activeModel.deSerializeDiagram(deserializedData, this.diagramEngine);
    const allNodes = this.activeModel.getNodes();
    console.log("all nodes in activeModel ", allNodes);
    for (let node in allNodes) {
      if (allNodes.hasOwnProperty(node)) {
        const nodeToAdd = allNodes[node];
        this.addListenersOnNode(nodeToAdd);
      }
    }
    const links = this.activeModel.getLinks();
    for (let link in links) {
      if (links.hasOwnProperty(link)) {
        const sourceName = links[link].sourcePort.parent.name;
        const targetName = links[link].targetPort.parent.name;
        if (!links[link].labels.length) {
          links[link].addLabel(`${sourceName} to ${targetName}`);
        }
      }
    }
    console.log("new active model with links ", this.activeModel);
  }

  serializerToSchema() {
    console.log("current active model ", this.activeModel);
    const serializedObject = this.activeModel.serializeDiagram();
    console.log("serialized object ", serializedObject);
    const serializedData = JSON.stringify(serializedObject);
    sendSchemaUpdate(serializedData);
  }

  addListenersOnNode(nodeToAdd) {
    nodeToAdd.addListener({
      selectionChanged: () => {
        setTimeout(this.serializerToSchema.bind(this), 0);
        store.dispatch(setIssueFilter(nodeToAdd.name));
      },
      entityRemoved: () => {
        setTimeout(this.serializerToSchema.bind(this), 0);
      }
    });
  }

  getActiveDiagram() {
    return this.activeModel;
  }

  getDiagramEngine() {
    return this.diagramEngine;
  }
}
