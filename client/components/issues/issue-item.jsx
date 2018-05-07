import React, { Component } from "react";
import {
    Button,
    Divider,
    Form,
    List,
    Modal,
} from "semantic-ui-react";

import { AssigneeLabel } from "./index";

class IssueItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const issue = this.props.issue;
        return (
            <List.Item>
                <Modal trigger={<Button fluid>{issue.title}</Button>}>
                    <Modal.Header>
                        Edit Issue #{issue.number}
                    </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>First Name</label>
                                <input placeholder="First Name" />
                            </Form.Field>
                            <Form.Field>
                                <label>Last Name</label>
                                <input placeholder="Last Name" />
                            </Form.Field>
                            <Button type="submit">Submit</Button>
                            <Divider />
                            {issue.assignees.map(assignee =>
                                (<AssigneeLabel
                                    key={assignee}
                                    assignee={assignee}
                                />)
                            )}
                        </Form>

                    </Modal.Content>
                </Modal>
            </List.Item>
        );
    }
}

export default IssueItem;
