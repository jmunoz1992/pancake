import React from "react";
import { Button, List, Modal } from "semantic-ui-react";
import { EditPullRequest } from "./index";

const PullRequestItem = props => {
  const { pullRequest } = props;
  return (
    <List.Item style={{ width: "300px" }}>
      <Modal
        trigger={<Button fluid>{pullRequest.title}</Button>}
        style={{ width: "500px", textAlign: "center" }}>
        <EditPullRequest key={pullRequest.id} pullRequest={pullRequest} />
      </Modal>
    </List.Item>
  );
};

export default PullRequestItem;
