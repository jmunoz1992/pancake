import * as SRD from "storm-react-diagrams";
import {
	DiagramEngine,
	DiagramModel,
	DiagramProps,
	DefaultNodeModel,
	LinkModel,
	DiagramWidget
} from "storm-react-diagrams";
// import { action } from "@storybook/addon-actions";

export class Application {
	protected activeModel: SRD.DiagramModel;
	protected diagramEngine: SRD.DiagramEngine;

	constructor() {
		this.diagramEngine = new SRD.DiagramEngine();
		this.diagramEngine.installDefaultFactories();

		this.newModel();
	}

	public newModel() {
		this.activeModel = new SRD.DiagramModel();
    this.diagramEngine.setDiagramModel(this.activeModel);
    var model = new DiagramModel();

		//3-A) create a default node
		var node1 = new SRD.DefaultNodeModel("Project", "rgb(0,192,255)");
    let portOne = node1.addOutPort("Owner");
    let portTwo = node1.addOutPort("Repository");
    let portThree = node1.addOutPort("projectId");
    node1.setPosition(100, 100);

		//3-B) create another default node
    var node2 = new SRD.DefaultNodeModel("User", "rgb(192,255,0)");
    let portFour = node2.addInPort("Username");
    let portFive = node2.addInPort("Password");
    let portSix = node2.addInPort("activeProjectId");
		node2.setPosition(400, 100);

		// link the ports
		let link1 = portThree.link(portSix);

    this.activeModel.addAll(node1, node2, link1);

	// add all the models
    let models = model.addAll(node1, node2, link1);
    //     // add a selection listener to each
    // models.forEach(item => {
    //   item.addListener({
    //     selectionChanged: action("selectionChanged")
    //   });
    // });
	}

	public getActiveDiagram(): SRD.DiagramModel {
		return this.activeModel;
	}

	public getDiagramEngine(): SRD.DiagramEngine {
		return this.diagramEngine;
	}
}
