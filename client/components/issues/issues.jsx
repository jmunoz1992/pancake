import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { } from "../store";
import { List } from "semantic-ui-react";
import { IssueItem } from "../index";

const Issues = props => {
  const { issues } = props;
  console.log("issues ", issues);
  return (
    <div>
      <h1>Issues</h1>
      <List>
        {issues.map(issue =>
          <IssueItem key={issue.id} issue={issue} />
        )}
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

export default withRouter(connect(mapState, mapDispatch)(Issues));
