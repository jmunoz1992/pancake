import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Divider, Grid, Icon, Input, Message, Modal, Select } from "semantic-ui-react";

import { AssigneeLabel, LabelLabel } from "./index";
import { createIssue } from "../../store/issues";

class AddIssue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAssignee: "",
      selectedLabel: "",
      modalOpen: false,
      hideNoTitleWarning: true,
      hideNoBodyWarning: true
    };
  }

  componentDidMount = () => {
    this.setState({
      title: "",
      body: "",
      state: "open",
      assignees: [],
      labels: [],
      hideNoBodyWarning: true,
      hideNoTitleWarning: true,
      modalOpen: false
    });
  };

  handleChange = (evt, { name, value }) => {
    this.setState({ [name]: value });
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  cancel = () => {
    this.setState({
      title: "",
      body: "",
      state: "open",
      labels: [],
      assignees: [],
      selectedLabel: {},
      selectedAssignee: {},
      hideNoTitleWarning: true,
      hideNoBodyWarning: true,
      modalOpen: false
    });
  };

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
  };

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
  };

  addAssignee = () => {
    if (this.state.selectedAssignee) {
      const assignees = [...this.state.assignees, this.state.selectedAssignee];
      this.setState({ assignees, selectedAssignee: "" });
    }
  };

  addLabel = () => {
    if (this.state.selectedLabel) {
      const labels = [...this.state.labels, this.state.selectedLabel];
      this.setState({ labels, selectedLabel: "" });
    }
  };

  removeAssignee = login => {
    const assignees = [];
    for (let i = 0; i < this.state.assignees.length; i++) {
      if (this.state.assignees[i] !== login) assignees.push(this.state.assignees[i]);
    }
    this.setState({ assignees });
  };

  removeLabel = name => {
    const labels = [];
    for (let i = 0; i < this.state.labels.length; i++) {
      if (this.state.labels[i] !== name) labels.push(this.state.labels[i]);
    }
    this.setState({ labels });
  };

  handleSubmit = () => {
    const { title, body, state, labels, assignees } = this.state;
    let goodSubmit = true;
    if (title === "") {
      this.setState({ hideNoTitleWarning: false });
      goodSubmit = false;
    } else {
      this.setState({ hideNoTitleWarning: true });
    }
    if (body === "") {
      this.setState({ hideNoBodyWarning: false });
      goodSubmit = false;
    } else {
      this.setState({ hideNoBodyWarning: true });
    }

    if (!goodSubmit) return;
    const newIssue = { title, body, state, labels, assignees };
    this.props.createIssue(newIssue);
    this.cancel();
  };

  render() {
    const issue = this.state;
    const collabOptions = this.findUnassignedCollabs(issue.assignees, this.props.collaborators).map(
      collab => ({
        key: collab.login,
        text: collab.login,
        image: collab.avatar_url,
        value: collab.login
      })
    );
    const labelOptions = this.findUnnassignedLabels(issue.labels, this.props.labels).map(label => ({
      key: label.name,
      text: label.name,
      value: label.name
    }));
    return (
      <div>
        <Button
          floated="right"
          onClick={this.openModal}
          style={{ backgroundColor: "#00b5ad", color: "white" }}>
          Add A New Issue
        </Button>
        <Modal open={this.state.modalOpen}>
          <Modal.Header>New Issue</Modal.Header>
          <Modal.Content>
            {/* Edit Title */}
            <Input fluid label="Title" name="title" onChange={this.handleChange} placeholder="Enter Title" />
            <Message hidden={this.state.hideNoTitleWarning} attached="bottom" warning>
              <Icon name="warning sign" />Issue must contain a title
            </Message>

            <Divider hidden />

            {/* Edit Body */}
            <Input
              fluid
              name="body"
              label="Body"
              onChange={this.handleChange}
              placeholder="Enter Body"
              value={this.state.body}
            />
            <Message hidden={this.state.hideNoBodyWarning} attached="bottom" warning>
              <Icon name="warning sign" />Issue must contain a body
            </Message>

            <Divider hidden />
            <Grid divided columns="equal">
              <Grid.Row>
                <Grid.Column>
                  {/* Select Assignee */}
                  <Select
                    name="selectedAssignee"
                    label="Assignees"
                    onChange={this.handleChange}
                    options={collabOptions}
                    placeholder="Select Assignees"
                  />
                  <Button icon onClick={this.addAssignee}>
                    <Icon name="add" />
                  </Button>
                </Grid.Column>
                <Grid.Column>
                  {/* Select Label */}
                  <Select
                    name="selectedLabel"
                    label="Add Labels"
                    onChange={this.handleChange}
                    options={labelOptions}
                    placeholder="Select Labels"
                  />
                  <Button icon onClick={this.addLabel}>
                    <Icon name="add" />
                  </Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  {/* Assignee List */}
                  {this.state.assignees ? (
                    this.state.assignees.map(login => (
                      <div key={login} onClick={() => this.removeAssignee(login)}>
                        <AssigneeLabel login={login} />
                      </div>
                    ))
                  ) : (
                    <div />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {/* Label List */}
                  {this.state.labels ? (
                    this.state.labels.map(name => (
                      <div key={name} onClick={() => this.removeLabel(name)}>
                        <LabelLabel name={name} />
                      </div>
                    ))
                  ) : (
                    <div />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Submit
            </Button>
            <Button color="red" onClick={this.cancel}>
              <Icon name="cancel" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapState = ({ labels, collaborators }) => ({ labels, collaborators });
const mapDispatch = { createIssue };

export default connect(mapState, mapDispatch)(AddIssue);
