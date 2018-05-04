import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {} from "../store";

const Issues = props => {
  const { issues } = props;
  console.log("issues ", issues);
  return (
    <div>
      <h1>Issues</h1>
      {issues.map(issue => {
        console.log("issue ", issue);
      })}
    </div>
  );
};

const mapState = ({ issues }) => {
  return {
    issues
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default withRouter(connect(mapState, mapDispatch)(Issues));
