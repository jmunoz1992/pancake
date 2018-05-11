import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Divider, Grid, Icon, Input, Message, Modal, Select } from "semantic-ui-react";

import { AssigneeLabel, LabelLabel } from "./index";
// import { addAssignee, editIssue, addLabel } from "../../store/issues";

class EditIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAssignee: "",
            selectedLabel: "",
        };
    }

    componentDidMount = () => {
        const { title, body, state, assignees, labels, id, number } = this.props.activeIssue;
        const assigneeLogins = assignees.map(assignee => assignee.login);
        const labelNames = labels.map(label => label.name);
        this.setState({ title, body, state, assignees: assigneeLogins, labels: labelNames, id, number });
    }

    handleChange = (evt, { name, value }) => { this.setState({ [name]: value }); }

    findUnassignedCollabs = (assignedCollabs, allCollabs) => {
        if (!assignedCollabs) return allCollabs;
        let result = [];
        let found = false;
        for (let i = 0; i < allCollabs.length; i++) {
            found = false;
            for (let j = 0; j < assignedCollabs.length; j++) {
                if (allCollabs[i].login === assignedCollabs[j]) found = true;
            }
            if (!found) result.push(allCollabs[i]);
        }
        return result;
    }

    findUnnassignedLabels = (assignedLabels, allLabels) => {
        if (!assignedLabels) return allLabels;
        let result = [];
        let found = false;
        for (let i = 0; i < allLabels.length; i++) {
            found = false;
            for (let j = 0; j < assignedLabels.length; j++) {
                if (allLabels[i].name === assignedLabels[j]) found = true;
            }
            if (!found) result.push(allLabels[i]);
        }
        return result;
    }

    addAssignee = () => {
        if (!this.state.selectedAssignee) {
            console.log("No assignee selected");
        } else {
            const assignees = [...this.state.assignees, this.state.selectedAssignee];
            this.setState({ assignees, selectedAssignee: "" });
        }

    }

    addLabel = () => {
        if (!this.state.selectedLabel) {
            console.log("No label selected");
        } else {
            const labels = [...this.state.labels, this.state.selectedLabel];
            this.setState({ labels, selectedLabel: "" });
        }
    }

    render() {
        const collabOptions = this.findUnassignedCollabs(this.state.assignees, this.props.collaborators)
            .map(collab => ({
                key: collab.id,
                text: collab.login,
                image: collab.avatar_url,
                value: collab.login
            }));
        const labelOptions = this.findUnnassignedLabels(this.state.labels, this.props.labels)
            .map(label => ({
                key: label.id,
                text: label.name,
                value: label.name,
            }));
        return (
            <Modal.Content>
                <h1>Issue #{this.state.number}</h1>
                <Divider />

                {/* Edit Title */}
                <Input fluid name="title" label="Title" onChange={this.handleChange} placeholder="Enter Title" value={this.state.title} />

                <Divider hidden />

                {/* Edit Body */}
                <Input fluid name="body" label="Body" onChange={this.handleChange} placeholder="Enter Body" value={this.state.body} />

                <Divider hidden />
                <Grid divided columns="equal">
                    <Grid.Row>
                        <Grid.Column>

                            {/* Select Assignee */}
                            <Select name="selectedAssignee" label="Assignees" onChange={this.handleChange} options={collabOptions} placeholder="Select Assignees" />
                            <Button icon onClick={this.addAssignee}><Icon name="add" /></Button>

                        </Grid.Column>
                        <Grid.Column>

                            {/* Select Label */}
                            <Select name="selectedLabel" label="Add Labels" onChange={this.handleChange} options={labelOptions} placeholder="Select Labels" />
                            <Button icon onClick={this.addLabel}><Icon name="add" /></Button>

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>

                            {/* Assignee List */}
                            {this.state.assignees
                                ? this.state.assignees.map(login => <AssigneeLabel key={login} login={login} />)
                                : <div />}

                        </Grid.Column>
                        <Grid.Column>

                            {/* Label List */}
                            {this.state.labels
                                ? this.state.labels.map(name => <LabelLabel key={name} name={name} />)
                                : <div />}

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>

        );
    }
}

const mapState = ({ issues, collaborators, labels }, ownProps) => {
    const activeIssue = issues.issueList.find(issue => issue.id === ownProps.issue.id);
    return ({
        activeIssue,
        collaborators,
        labels,
    });
};

// const mapDispatch = ;

export default connect(mapState, null)(EditIssue);
