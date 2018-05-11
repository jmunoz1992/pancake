import React from "react";
import { Button, List, Modal } from "semantic-ui-react";

import { EditIssue } from "./index";

const IssueItem = props => {
  const { issue } = props;
  return (
    <List.Item>
      <Modal trigger={<Button fluid>{issue.title}</Button>}>
        <EditIssue key={issue.id} issue={issue} />
      </Modal>
    </List.Item>
  );
};

export default IssueItem;
