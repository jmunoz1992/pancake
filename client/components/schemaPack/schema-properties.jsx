import React, { Component } from "react";
import { connect } from "react-redux";

class SchemaProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ height: "50%", overflowY: "scroll", paddingRight: "10px" }}>
        <h1>I AM IN SCHEMA PROPERTIES</h1>
      </div>
    );
  }
}

const mapState = state => {};

const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(SchemaProperties);
