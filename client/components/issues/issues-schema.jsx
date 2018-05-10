import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { } from "../store";
import { List } from "semantic-ui-react";
import { IssueItem } from "../index";

const IssuesSchema = props => {
  const { issues } = props;
  return (
    <div>
      <h1>Issues Schema</h1>
      <List>
        {issues.map(issue => {
          return issue.labels.map(label => {
            if (label.name === "backend") {
              return <IssueItem key={issue.id} issue={issue} />;
            }
          });
        })}
      </List>
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

export default withRouter(connect(mapState, mapDispatch)(IssuesSchema));
