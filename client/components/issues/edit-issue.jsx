import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Divider, Form, Modal } from "semantic-ui-react";

import { AssigneeLabel, LabelLabel } from "./index";
import { addAssignee, editIssue } from "../../store/issues";

class EditIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAssignee: {},
            assignees: [],
            selectedLabel: {},
            labels: [],
        };
    }

    componentWillReceiveProps = (newProps, oldProps) => {
        if (newProps.issue.assignees !== oldProps.issue.assignees) {
            this.setState({
                assignees: newProps.issue.assignees,
            });
        }
        if (newProps.issue.labels !== oldProps.issue.labels) {
            this.setState({
                labels: newProps.issue.labels,
            });
        }
    }

    componentDidMount = () => {
        this.setState({
            issue: this.props.issue,
            assignees: this.props.issue.assignees,
            labels: this.props.issue.labels,
        });
    }

    onChange = (evt, { name, value }) => {
        this.setState({ [name]: value });
    }

    addAssignee = () => {
        const newAssignees = [...this.state.assignees, this.state.selectedAssignee];
        this.setState({ assignees: newAssignees });
        this.props.addAssignee(this.props.issue.number, newAssignees);
    }

    addIssue = () => {
        console.log("CLICKED");
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

    findUnnassignedLabels = (assignedLabels, allLabels) => {
        let result = [];
        let found = false;
        for (let i = 0; i < allLabels.length; i++) {
            found = false;
            for (let j = 0; j < assignedLabels.length; j++) {
                if (allLabels[i].id === assignedLabels[j].id) found = true;
            }
            if (!found) result.push(allLabels[i]);
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
        const labelOptions = this.findUnnassignedLabels(this.props.issue.labels, this.props.labels)
            .map(label => ({
                key: label.id,
                text: label.name,
                value: label,
            }));
        if (!issue) return (<div />);
        return (
            <Modal.Content>
                <Form>
                    <Form.Field>
                        <label>Title</label>
                        <input placeholder="First Name" />
                    </Form.Field>
                    <Form.Field>
                        <label>Body</label>
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
                                issue={issue}
                            />)
                        )}
                </Form>
                <Divider />
                <Form onSubmit={this.addIssue}>
                    <Form.Field>
                        <Form.Select
                            label="Add Label"
                            name="selectedLabel"
                            onChange={this.onChange}
                            options={labelOptions}
                            placeholder="Select" />
                        <Button type="submit">Add Label</Button>
                        {issue.labels
                            .map(label =>
                                (<LabelLabel
                                    key={label.id}
                                    label={label}
                                    issue={issue}
                                />))}
                    </Form.Field>
                </Form>
            </Modal.Content>
        );
    }
}

const mapState = ({ issues, collaborators, labels }, ownProps) => {
    console.log("labels", labels);
    return {
        issue: issues.find(issue => issue.id === ownProps.issue.id),
        collaborators,
        labels,
    };
};

const mapDispatch = { editIssue, addAssignee };

export default connect(mapState, mapDispatch)(EditIssue);
