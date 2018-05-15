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
    console.log("deserialized data", deserializedData);
    if (!Object.keys(deserializedData).length) {
      console.log("getting in deserializer");
      this.activeModel = new SRD.DiagramModel();
      this.diagramEngine.setDiagramModel(this.activeModel);
      return;
    }
    this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);
    this.activeModel.deSerializeDiagram(deserializedData, this.diagramEngine);
    const allNodes = this.activeModel.getNodes();
    for (let node in allNodes) {
      if (allNodes.hasOwnProperty(node)) {
        const nodeToAdd = allNodes[node];
        this.addListenersOnNode(nodeToAdd);
      }
    }

    console.log("new active model with links ", this.activeModel);
  }

  serializerToSchema() {
    console.log(this);
    const serializedObject = this.activeModel.serializeDiagram();
    const serializedData = JSON.stringify(serializedObject);
    sendSchemaUpdate(serializedData);
  }

  addListenersOnNode(nodeToAdd) {
    nodeToAdd.addListener({
      selectionChanged: () => {
        setTimeout(this.serializerToSchema.bind(this), 0);
        const nodeName = nodeToAdd.name.toLowerCase();
        console.log("node name ", nodeName);
        const labelObj = {
          labels: [nodeName]
        };
        store.dispatch(setIssueFilter(labelObj));
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
