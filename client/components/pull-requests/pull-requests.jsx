import React from "react";
import { Button, List, Modal } from "semantic-ui-react";
import PullRequestItem from "./pull-request-item";

const PullRequests = props => {
  const { allPullRequests } = props;
  return (
    <div>
      <Modal
        trigger={
          <Button fluid color="blue">
            See All Open Pull Requests
          </Button>
        }
        style={{ width: "550px" }}>
        <Modal.Content>
          <h1 style={{ textAlign: "center" }}>All Open Pull Requests</h1>
          <List>
            {allPullRequests.map(pullRequest => (
              <PullRequestItem key={pullRequest.id} pullRequest={pullRequest} />
            ))}
          </List>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default PullRequests;
