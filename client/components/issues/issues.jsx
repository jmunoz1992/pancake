import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { } from "../store";
import { Divider, List } from "semantic-ui-react";
import { AddIssue, EditIssue } from "../index";

const Issues = props => {
  let { issues, filter } = props;
  if (filter) {
    issues = issues.filter(
      issue => issue.title.toLowerCase().includes(filter) || issue.body.toLowerCase().includes(filter)
    );
  }
  return (
    <div>
      <AddIssue />
      <Divider />
      {filter ? <h3>Showing '{filter}' issues</h3> : null}
      <List>
        {issues.map(issue => {
          return (
            <div>
              <br />
              <EditIssue key={issue.id} issue={issue} />
              <br />
            </div>
          );
        })}
      </List>
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
