import * as React from "react";

import { BodyWidget } from "./widgets/BodyWidget";
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
    console.log("Schema componentDidMount");
    connectToSession(newJson => {
      this.setState({ diagramJson: newJson });
    });
  }

  render() {
    var app = new Application(this.state.diagramJson);
    return <BodyWidget app={app} />;
  }
}

export default Schema;
