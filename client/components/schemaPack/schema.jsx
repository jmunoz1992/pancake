import * as React from "react";

import { default as BodyWidget } from "./widgets/BodyWidget";
import { Application } from "./Application";
import "./css/main.css";
import { connectToSession } from "../../socket/schema";

class Schema extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diagramJson: ""
    };
    this.widgetRef = React.createRef();
  }

  componentDidMount() {
    connectToSession(newJson => {
      this.setState({ diagramJson: newJson });
      if (!this.app) {
        this.app = new Application();
      }
      this.app.deserializeSchema(newJson);

      // This is awful but necessary to cause the diagram to visually update when someone else makes
      // a change to it.
      const bodyWidget = this.widgetRef.current;
      const stormWidget = bodyWidget && bodyWidget.wrappedInstance.stormRef.current;
      if (stormWidget) stormWidget.forceUpdate();
      this.forceUpdate();
    });
  }

  render() {
    if (this.app) return <BodyWidget ref={this.widgetRef} app={this.app} />;
    return <div>Loading...</div>;
  }
}

export default Schema;
