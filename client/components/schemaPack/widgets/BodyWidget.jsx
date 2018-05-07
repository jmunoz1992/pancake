import * as React from "react";
import * as _ from "lodash";
import { TrayWidget } from "./TrayWidget";
import { Application } from "../Application";
import { TrayItemWidget } from "./TrayItemWidget";
import { DefaultNodeModel, DiagramWidget } from "storm-react-diagrams";
require("storm-react-diagrams/dist/style.min.css");

export class BodyWidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      title: "",
      portName: "",
      nodeColor: "",
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(this.state.title);
    console.log(this.state.portName);
    console.log(this.state.nodeColor);
  }

  handleTitleChange = (event) => {
    this.setState({ title: event.target.value}, () => {
    });
  }

  handlePortNameChange = (event) => {
    this.setState({ portName: event.target.value}, () => {
    });
  }

  handleNodeColorChange = (event) => {
    this.setState({ nodeColor: event.target.value}, () => {
    });
  }


	render() {
		return (
			<div className="body">
				<div className="header">
					<div className="title">Build your schema below!</div>
				</div>
        <div className="content">
          <TrayWidget>
            <TrayItemWidget model={{ type: "in" }} name="In Node" color="rgb(192,255,0)" />
            <form onSubmit={(event) => { this.handleSubmit(event); }} >
              <label style={{'color': 'white'}}>In Node Title: </label>
              <br />
              <input onChange={this.handleTitleChange} name="title" value={this.state.title} />
              <br />
              <label style={{'color': 'white'}}>In Node Port Name: </label>
              <br />
              <input onChange={this.handlePortNameChange} name="portName" value={this.state.portName} />
              <br />
              <label style={{'color': 'white'}}>{`Node Color (format must be rgb())`} </label>
              <br />
              <input onChange={this.handleNodeColorChange} name="nodeColor" value={this.state.nodeColor} />
              <br />
              <br />
              <input type="submit" value="Submit" />
            </form>
						<TrayItemWidget model={{ type: "out" }} name="Out Node" color="rgb(0,192,255)" />
          </TrayWidget>
					<div
						className="diagram-layer"
						onDrop={event => {
							var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
							var nodesCount = _.keys(
								this.props.app
									.getDiagramEngine()
									.getDiagramModel()
									.getNodes()
							).length;

							var node = null;
							if (data.type === "in") {
								node = new DefaultNodeModel(this.state.title, this.state.nodeColor);
								node.addInPort(this.state.portName);
							} else {
								node = new DefaultNodeModel("Node " + (nodesCount + 1), "rgb(0,192,255)");
								node.addOutPort("Out");
							}
							var points = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.x = points.x;
							node.y = points.y;
							this.props.app
								.getDiagramEngine()
								.getDiagramModel()
								.addNode(node);
							this.forceUpdate();
						}}
						onDragOver={event => {
							event.preventDefault();
						}}
					>
						<DiagramWidget className="srd-demo-canvas" diagramEngine={this.props.app.getDiagramEngine()} />
					</div>
				</div>
			</div>
		);
	}
}
