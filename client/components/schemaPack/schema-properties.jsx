import React, { Component } from "react";
import { connect } from "react-redux";
import { setIssueFilter } from "../../store/issues";

class SchemaProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.filterBackendIssues();
  }

  render() {
    return (
      <div style={{ height: "50%", overflowY: "scroll", paddingRight: "10px" }}>
        <h1>I AM IN SCHEMA PROPERTIES</h1>
      </div>
    );
  }
}

const mapState = state => {
  return {};
};

const mapDispatch = dispatch => ({
  filterBackendIssues() {
    dispatch(setIssueFilter("backend"));
  }
});

export default connect(mapState, mapDispatch)(SchemaProperties);
