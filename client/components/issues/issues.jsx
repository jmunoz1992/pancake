import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Divider, List } from "semantic-ui-react";
import { AddIssue, EditIssue } from "../index";

const Issues = props => {
  let { issues, filter } = props;
  if (filter) {
    issues = issues.filter(issue => testIssueAgainstFilter(issue, filter));
  }
  return (
    <div>
      <AddIssue />
      <Divider />
      {Object.keys(filter).length ? (
        <p>
          Filtering by issues...<br />
          {describeFilter(filter)}
        </p>
      ) : null}
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

const describeFilter = filter => {
  let description = [];

  if (filter.status) {
    description.push(
      <em key="status">
        ...with status <strong>{filter.status}</strong>
        <br />
      </em>
    );
  }

  if (filter.assignees) {
    description.push(
      <em key="assignees">
        ...assigned to <strong>{filter.assignees.join(", ")}</strong>
        <br />
      </em>
    );
  }

  if (filter.labels) {
    description.push(
      <em key="labels">
        ...labeled <strong>{filter.labels.join(", ")}</strong>
        <br />
      </em>
    );
  }

  if (filter.text) {
    description.push(
      <em key="text">
        ...with the words <strong>{filter.text.join(", ")}</strong> in the title or body
        <br />
      </em>
    );
  }

  return <span>{description}</span>;
};

const testLabels = (issue, filter) => {
  if (filter.labels) {
    // Generate an array containing only the names of labels in the issue, then check if the list of
    // filtered labels is a subset of that array.
    const issueLabels = new Set(issue.labels.map(label => label.name));
    for (const label of filter.labels) {
      if (!issueLabels.has(label)) return false;
    }
  }
  return true;
};

const testAssignees = (issue, filter) => {
  if (filter.assignees) {
    // Same approach as labels.  Assignee names are on the 'login' property.
    const issueAssignees = new Set(issue.assignees.map(assignee => assignee.login));
    for (const assignee of filter.assignees) {
      if (!issueAssignees.has(assignee)) return false;
    }
  }
  return true;
};

const testIssueAgainstFilter = (issue, filter) => {
  if (filter.status) {
    // Status maps to state on the GitHub issue object.
    if (filter.status !== issue.state) return false;
  }
  if (filter.text) {
    // TODO: Implement text condition
  }
  if (!testLabels(issue, filter)) return false;
  if (!testAssignees(issue, filter)) return false;
  return true;
};

const mapState = ({ issues }) => {
  return { issues: issues.issueList, filter: issues.filter };
};

export default withRouter(connect(mapState, null)(Issues));
