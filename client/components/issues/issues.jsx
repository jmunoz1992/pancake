import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { } from "../store";
import { List } from "semantic-ui-react";
import { IssueItem } from "../index";

const Issues = props => {
  const { issues, filter } = props;
  console.log("these are the filtered issues ", filter);
  return (
    <div>
      <h1>Issues</h1>
      {filter ? (
        <List>
          {issues.map(issue => {
            return issue.labels.map(label => {
              if (label.name === filter) {
                console.log("inside issues map loop ", issue);
                return <IssueItem key={issue.id} issue={issue} />;
              }
            });
          })}
        </List>
      ) : (
        <List>{issues.map(issue => <IssueItem key={issue.id} issue={issue} />)}</List>
      )}
    </div>
  );
};

const mapState = ({ issues }) => {
  return {
    issues: issues.issueList,
    filter: issues.filter
  };
};

const mapDispatch = dispatch => {
  return {};
};

export default withRouter(connect(mapState, mapDispatch)(Issues));
