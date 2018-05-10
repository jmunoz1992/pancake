import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { } from "../store";
import { List } from "semantic-ui-react";
import { IssueItem } from "../index";
import { fetchIssues } from "../../store/issues";

const Issues = props => {
  console.log("props in Issues ", props);
  const { issues } = props;
  return (
    <div>
      <h1>Issues</h1>
      <List>{issues.map(issue => <IssueItem key={issue.id} issue={issue} />)}</List>
    </div>
  );
};

const mapState = ({ issues }) => {
  console.log("issues in mapState", issues);
  return {
    issues: issues.issueList
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default withRouter(connect(mapState, mapDispatch)(Issues));
