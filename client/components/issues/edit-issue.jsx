import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Divider, Form, Modal, Select } from "semantic-ui-react";

import { AssigneeLabel } from "./index";

class EditIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAssignee: {},
        };
    }

    componentDidMount = () => {
        this.setState({ issue: this.props.issue });
    }

    onChange = (evt, { name, value }) => {
        this.setState({ [name]: value });
    }

    findUnassignedCollabs = (assignedCollabs, allCollabs) => {
        let result = [];
        let found = false;
        for (let i = 0; i < allCollabs.length; i++) {
            found = false;
            for (let j = 0; j < assignedCollabs.length; j++) {
                if (allCollabs[i].login === assignedCollabs[j].login) found = true;
            }
            if (!found) result.push(allCollabs[i]);
        }
        return result;
    }

    render() {
        console.log("state", this.state);
        console.log("props", this.props);
        const { issue } = this.state;
        const collabOptions = this.findUnassignedCollabs(this.props.issue.assignees, this.props.collaborators)
            .map(collab => ({
                key: collab.id,
                text: collab.login,
                image: collab.avatar_url,
                value: collab.login
            }));
        if (!issue) return (<div />);
        return (
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
                    <Divider />
                    <Form.Field>
                        <Form.Select
                            label="Add Assignee"
                            name="selectedAssignee"
                            onChange={this.onChange}
                            options={collabOptions}
                            placeholder="Select" />
                        {issue.assignees
                            .map(assignee =>
                                (<AssigneeLabel
                                    key={assignee.id}
                                    assignee={assignee}
                                />)
                            )}
                    </Form.Field>
                    <Divider />
                    <Button type="submit">Submit</Button>
                </Form>
            </Modal.Content>
        );
    }
}

const mapState = ({ issues, collaborators }, ownProps) => {
    return {
        issue: issues.find(issue => issue.id === ownProps.issue.id),
        collaborators,
    };
};

export default connect(mapState)(EditIssue);
