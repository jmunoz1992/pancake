import React, { Component } from "react";
import { connect } from "react-redux";

class Properties extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3>Properties</h3>
        <p>Size: {`H${this.props.element.height} W${this.props.element.width}`}</p>
      </div>
    );
  }
}

export default connect(null, null)(Properties);
