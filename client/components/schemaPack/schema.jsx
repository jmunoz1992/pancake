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
  }

  componentDidMount() {
    connectToSession(newJson => {
      this.setState({ diagramJson: newJson });
      console.log("connectToSession");
      if (this.app) this.app.deserializer(newJson);
      else this.app = new Application(newJson);
      this.forceUpdate();
    });
  }

  render() {
    if (this.app) return <BodyWidget app={this.app} />;
    return <div>Loading...</div>;
  }
}

export default Schema;
