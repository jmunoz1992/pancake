import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Divider, Form, Modal } from "semantic-ui-react";

import { AssigneeLabel } from "./index";
import { addAssignee, editIssue } from "../../store/issues";

class EditIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAssignee: {},
            assignees: [],
        };
    }

    componentWillReceiveProps = (newProps, oldProps) => {
        if (newProps.issue.assignees !== oldProps.issue.assignees) {
            this.setState({
                assignees: newProps.issue.assignees
            });
        }
    }

    componentDidMount = () => {
        this.setState({
            issue: this.props.issue,
            assignees: this.props.issue.assignees,
        });
    }

    onChange = (evt, { name, value }) => {
        this.setState({ [name]: value });
    }

    addAssignee = () => {
        console.log("issue", this.props.issue);
        const newAssignees = [...this.state.assignees, this.state.selectedAssignee];
        this.setState({ assignees: newAssignees });
        this.props.addAssignee(this.props.issue.number, newAssignees);
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
        const { issue } = this.state;
        const collabOptions = this.findUnassignedCollabs(this.props.issue.assignees, this.props.collaborators)
            .map(collab => ({
                key: collab.id,
                text: collab.login,
                image: collab.avatar_url,
                value: collab
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
                    <Button type="submit">Submit</Button>
                </Form>
                <Divider />
                <Form onSubmit={this.addAssignee}>
                    <Form.Field>
                        <Form.Select
                            label="Add Assignee"
                            name="selectedAssignee"
                            onChange={this.onChange}
                            options={collabOptions}
                            placeholder="Select" />
                        <Button type="submit">Add Assignee</Button>
                    </Form.Field>
                    {issue.assignees
                        .map(assignee =>
                            (<AssigneeLabel
                                key={assignee.id}
                                assignee={assignee}
                            />)
                        )}
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

const mapDispatch = { editIssue, addAssignee };

export default connect(mapState, mapDispatch)(EditIssue);
