import React, { Component } from "react";
import { Navbar, Sidebar } from "./index";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchIssues } from "../store";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadIssues();
  }

  render() {
    return (
      <div>
        <Navbar />
        <Sidebar />
      </div>
    );
  }
}

const mapDispatch = dispatch => {
  return {
    loadIssues() {
      dispatch(fetchIssues());
    }
  };
};

export default withRouter(connect(null, mapDispatch)(App));
