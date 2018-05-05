import React, { Component } from "react";
import { connect } from "react-redux";

class Properties extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h2>Properties</h2>
        {this.props.element ? this.renderElementProperties() : <p>Nothing selected.</p>}
      </div>
    );
  }

  renderElementProperties() {
    return (
      <p style={{ wordWrap: "break-word" }}>
        Selected Element:<br />
        {JSON.stringify(this.props.element)}
      </p>
    );
  }
}

const mapState = state => {
  const { selectedElement, elements } = state.designerState;
  const selectedElementObj = elements.find(e => e.id === selectedElement);
  return { element: selectedElementObj };
};

export default connect(mapState, null)(Properties);
