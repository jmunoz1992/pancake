import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Divider, Form, Icon, Modal } from "semantic-ui-react";

import { AssigneeLabel, LabelLabel } from "./index";
import { addAssignee, editIssue, addLabel } from "../../store/issues";

class EditIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAssignee: {},
      assignees: [],
      selectedLabel: {},
      labels: []
    };
  }

  componentWillReceiveProps = (newProps, oldProps) => {
    if (newProps.issue.assignees !== oldProps.issue.assignees) {
      this.setState({
        assignees: newProps.issue.assignees
      });
    }
  };

  componentDidMount = () => {
    this.setState({
      issue: this.props.issue,
      assignees: this.props.issue.assignees,
      labels: this.props.issue.labels
    });
  };

  onChange = (evt, { name, value }) => {
    this.setState({ [name]: value });
  };

  onChangeTitle = event => {
    const { issue } = this.state;
    issue.title = event.target.value;
    this.setState({ issue });
  };

  onChangeBody = event => {
    const { issue } = this.state;
    issue.body = event.target.value;
    this.setState({ issue });
  };

  submitEditIssue = () => {
    this.props.editIssue(this.state.issue);
  };

  toggleState = () => {
    const { issue } = this.state;
    issue.state === "open" ? (issue.state = "closed") : (issue.state = "open");
    this.setState({ issue });
    this.props.editIssue(this.state.issue);
  };

  addAssignee = () => {
    const newAssignees = [...this.state.assignees, this.state.selectedAssignee];
    this.setState({ assignees: newAssignees });
    this.props.addAssignee(this.props.issue.number, newAssignees);
  };

  addLabel = () => {
    const newLabels = [...this.state.labels, this.state.selectedLabel];
    this.setState({ labels: newLabels });
    this.props.addLabel(this.props.issue.number, newLabels, this.props.issue.id);
  };

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
  };

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
  };

  render() {
    const { issue } = this.state;
    const collabOptions = this.findUnassignedCollabs(
      this.props.issue.assignees,
      this.props.collaborators
    ).map(collab => ({
      key: collab.id,
      text: collab.login,
      image: collab.avatar_url,
      value: collab
    }));
    const labelOptions = this.findUnnassignedLabels(this.props.issue.labels, this.props.labels).map(
      label => ({
        key: label.id,
        text: label.name,
        value: label
      })
    );
    if (!issue) return <div />;
    return (
      <Modal.Content>
        <h1 style={{ width: "100px", display: "inline" }}>ISSUE #{issue.number}</h1>
        <Button floated="right" color={issue.state === "open" ? "green" : "red"} onClick={this.toggleState}>
          {issue.state}
        </Button>
        <Divider />
        <Form onSubmit={this.submitEditIssue}>
          <Form.Input name="title" label="Title" onChange={this.onChangeTitle} value={issue.title} />
          <Form.Input name="body" label="Body" onChange={this.onChangeBody} value={issue.body} />
          <Button type="submit">Submit</Button>
        </Form>
        <Divider />
        <Form onSubmit={this.addAssignee}>
          <Form.Group widths="equal">
            <Form.Select
              name="selectedAssignee"
              onChange={this.onChange}
              options={collabOptions}
              placeholder="Add Assignee"
            />
            <Button icon type="submit">
              <Icon name="add" />
            </Button>
          </Form.Group>
          {issue.assignees.map(assignee => (
            <AssigneeLabel key={assignee.id} assignee={assignee} issue={issue} />
          ))}
        </Form>
        <Divider />
        <Form onSubmit={this.addLabel}>
          <Form.Group widths="equal">
            <Form.Select
              name="selectedLabel"
              onChange={this.onChange}
              options={labelOptions}
              placeholder="Add Label"
            />
            <Button icon type="submit">
              <Icon name="add" />
            </Button>
          </Form.Group>
          {issue.labels.map(label => {
            return <LabelLabel key={label.id} label={label} issue={issue} />;
          })}
        </Form>
      </Modal.Content>
    );
  }
}

const mapState = ({ issues, collaborators, labels }, ownProps) => {
  return {
    issue: issues.find(issue => issue.id === ownProps.issue.id),
    collaborators,
    labels
  };
};

const mapDispatch = { editIssue, addAssignee, addLabel };

export default connect(mapState, mapDispatch)(EditIssue);
