import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {} from "../store";
import { Card, Icon, Label } from "semantic-ui-react";

const Issues = props => {
  const { issues } = props;
  console.log("issues ", issues);
  return (
    <div>
      <h1>Issues</h1>
      {issues.map(issue => {
        return (
          <Card key={issue.id}>
            <Card.Content header={issue.title} />
            <Card.Content description={issue.body} />
            <Card.Content extra>
              {issue.labels.map(label => {
                return (
                  <Label as="a" tag key={label.id} style={{ backgroundColor: `#${label.color}` }}>
                    {label.name}
                  </Label>
                );
              })}
            </Card.Content>
            <Card.Content extra>
              {issue.assignees.map(assignee => {
                return (
                  <Label as="a" image key={assignee.id}>
                    <img src={assignee.avatar_url} />
                    {assignee.login}
                  </Label>
                );
              })}
            </Card.Content>
          </Card>
        );
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
