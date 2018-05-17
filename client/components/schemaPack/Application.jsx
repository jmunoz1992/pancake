import * as SRD from "storm-react-diagrams";
import { sendSchemaUpdate } from "../../socket/schema";
import store from "../../store";
import { setIssueFilter } from "../../store/issues";
import { DefaultNodeModel, DefaultLinkModel } from "storm-react-diagrams";

export class Application {
  constructor() {
    this.diagramEngine = new SRD.DiagramEngine();
    this.diagramEngine.installDefaultFactories();
    this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);
    this.ports = [];
    this.json = "";
    console.log(this.activeModel, this.diagramEngine);
  }

  serializeSchema = () => {
    // DiagramModel.serializeDiagram includes a lot of data we do not want to synchronize with other
    // users, such as the zoom level, canvas offset, selected node, and so forth.  We only care
    // about the nodes and links themselves, so those are the only things we'll be serializing.
    const dataToSerialize = { nodes: {}, links: {} };

    // Loop through all nodes in the diagram.  For each one, call its built-in serialize method,
    // and store the result in our dataToSerialize object.
    const nodes = this.activeModel.getNodes();
    for (const key in nodes) {
      if (nodes.hasOwnProperty(key)) {
        const node = nodes[key];
        dataToSerialize.nodes[key] = node.serialize();
        // We don't want to synchronize the "selected" flag with other users, so set it to false.
        dataToSerialize.nodes[key].selected = false;
      }
    }

    // Repeat the process for links.
    const links = this.activeModel.getLinks();
    for (const key in links) {
      if (links.hasOwnProperty(key)) {
        const link = links[key];
        dataToSerialize.links[key] = link.serialize();
        dataToSerialize.links[key].selected = false;
      }
    }

    // Stringify dataToSerialize, and then check if the result is different from our last known JSON
    // string.  If it's identical, we don't need to send it to the server.
    const json = JSON.stringify(dataToSerialize);
    if (json !== this.json) {
      this.json = json;
      sendSchemaUpdate(json);
    }
  };

  deserializeSchema = json => {
    const { nodes, links } = JSON.parse(json);
    try {
      this.deserializeNodes(nodes);
      this.deserializeLinks(links);
    } catch (error) {
      console.log("Failed to deserialize JSON.", error);
      this.activeModel = new SRD.DiagramModel();
      this.diagramEngine.setDiagramModel(this.activeModel);
    }
  };

  // Loops through all of the deserialized node objects, and either creates a new NodeModel if the
  // node doesn't exist in our diagram, or updates an existing NodeModel if we can find one.
  deserializeNodes(nodeData) {
    const activeModelNodes = this.activeModel.getNodes();
    const nodesVisited = new Set();

    for (const key in nodeData) {
      if (nodeData.hasOwnProperty(key)) {
        const node = nodeData[key];
        // Keep track of the nodes we've seen, so we can determine if any have been deleted later.
        nodesVisited.add(key);
        if (activeModelNodes[key]) {
          activeModelNodes[key].deSerialize(node, this.diagramEngine);
        } else {
          const newNode = new DefaultNodeModel("", "");
          newNode.deSerialize(node, this.diagramEngine);
          this.addListenersOnNode(newNode);
          this.activeModel.addNode(newNode);
        }
      }
    }
    this.cleanupDeserializedNodes(nodesVisited);
  }

  // Locates nodes on our diagram that were not present in the serialized node list sent by the
  // server, and deletes those nodes from our diagram.
  cleanupDeserializedNodes(nodesVisited) {
    const activeModelNodes = this.activeModel.getNodes();
    for (const key in activeModelNodes) {
      if (activeModelNodes.hasOwnProperty(key)) {
        const node = activeModelNodes[key];
        if (!nodesVisited.has(node.id)) {
          // Remove all of the node's links, which requires looping through all ports and looping
          // through all links on each port.
          this.deleteNode(node);
        }
      }
    }
  }

  // Helper method to delete a node without leaving any lingering ports or links.
  deleteNode(node) {
    // First, loop through all ports on the node...
    for (const portKey in node.ports) {
      if (node.ports.hasOwnProperty(portKey)) {
        const port = node.ports[portKey];
        // Then, loop through all links on each port and delete them.
        for (const linkKey in port.links) {
          if (port.links.hasOwnProperty(linkKey)) {
            const link = port.links[linkKey];
            this.activeModel.removeLink(link);
          }
        }
      }
    }
    this.activeModel.removeNode(node);
  }

  // Mostly identical to deserializeNodes.
  deserializeLinks(linkData) {
    const activeModelLinks = this.activeModel.getLinks();
    const linksVisited = new Set();
    for (const key in linkData) {
      if (linkData.hasOwnProperty(key)) {
        const link = linkData[key];
        linksVisited.add(key);
        if (activeModelLinks[key]) {
          activeModelLinks[key].parent = this.activeModel;
          activeModelLinks[key].deSerialize(link, this.diagramEngine);
        } else {
          const newLink = new DefaultLinkModel();
          newLink.parent = this.activeModel; // The link deserializer crashes if we don't set this
          newLink.deSerialize(link, this.diagramEngine);
          this.activeModel.addLink(newLink);
        }
      }
    }
    this.cleanupDeserializedLinks(linksVisited);
  }

  cleanupDeserializedLinks(linksVisited) {
    const activeModelLinks = this.activeModel.getLinks();
    for (const key in activeModelLinks) {
      if (activeModelLinks.hasOwnProperty(key)) {
        const link = activeModelLinks[key];
        if (!linksVisited.has(key)) {
          this.activeModel.removeLink(link);
        }
      }
    }
  }

  addListenersOnNode(nodeToAdd) {
    nodeToAdd.addListener({
      selectionChanged: node => {
        if (node.isSelected) this.selectedNode = node.entity.id;
        else this.selectedNode = null;
        if (node.entity.extras.labels.length) {
          store.dispatch(setIssueFilter({ labels: node.entity.extras.labels }));
        }
      },
      entityRemoved: () => {
        setTimeout(this.serializeSchema.bind(this), 0);
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
