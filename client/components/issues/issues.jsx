import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { } from "../store";
import { List } from "semantic-ui-react";
import { EditIssue } from "../index";

const Issues = props => {
  let { issues, filter } = props;
  if (filter) {
    issues = issues.filter(
      issue => issue.title.toLowerCase().includes(filter) || issue.body.toLowerCase().includes(filter)
    );
  }
  return (
    <div>
      <h1>Issues</h1>
      {filter ? <h3>Showing '{filter}' issues</h3> : null}
      <List>{issues.map(issue => <EditIssue key={issue.id} issue={issue} />)}</List>
    </div>
  );
};

const mapState = ({ issues }) => {
  return { issues: issues.issueList, filter: issues.filter };
};

const mapDispatch = dispatch => {
  return {};
};

export default withRouter(connect(mapState, mapDispatch)(Issues));
