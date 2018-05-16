import * as SRD from "storm-react-diagrams";
import { sendSchemaUpdate } from "../../socket/schema";
import store from "../../store";
import { setIssueFilter } from "../../store/issues";

export class Application {
  constructor(json) {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.activeModel = new SRD.DiagramModel();
    this.selectedNode = null;
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
    this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);
    if (Object.keys(deserializedData).length) this.activeModel.deSerializeDiagram(deserializedData, this.diagramEngine);
    const allNodes = this.activeModel.getNodes();
    for (let node in allNodes) {
      if (allNodes.hasOwnProperty(node)) {
        const nodeToAdd = allNodes[node];
        this.addListenersOnNode(nodeToAdd);
      }
    }
  }

  serializerToSchema() {
    const serializedObject = this.activeModel.serializeDiagram();
    const serializedData = JSON.stringify(serializedObject);
    sendSchemaUpdate(serializedData);
  }

  addListenersOnNode(nodeToAdd) {
    nodeToAdd.addListener({
      selectionChanged: node => {
        if (node.isSelected) this.selectedNode = node.entity;
        else this.selectedNode = null;
        if (node.entity.extras.labels.length) {
          store.dispatch(setIssueFilter({ labels: node.entity.extras.labels }));
        }
      },
      entityRemoved: () => {
        setTimeout(this.serializerToSchema.bind(this), 0);
        this.selectedNode = null;
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
