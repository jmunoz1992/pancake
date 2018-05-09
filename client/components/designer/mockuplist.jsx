import React, { Component } from "react";
import { default as Library } from "./elements";
import { connect } from "react-redux";
import { List, Form, Button, Container } from "semantic-ui-react";
import styled from "styled-components";
import ToolboxItem from "./toolboxitem";
import { designerOperations, fetchMockupList, createNewMockup } from "../../store";

class MockupList extends Component {
  constructor(props) {
    super(props);
    this.state = { mockupName: "" };
  }

  componentDidMount() {
    console.log("Mount");
    this.props.fetchMockupList();
  }

  render() {
    return (
      <Container text>
        <h1>Mockup List</h1>
        <List divided verticalAlign="middle">
          {this.props.mockups.map(this.renderMockup)}
        </List>
        <hr />
        <h3>Create New Mockup</h3>
        <Form>
          <Form.Group widths="equal">
            <Form.Input
              label="Mockup Name"
              placeholder="Mockup Name"
              value={this.state.mockupName}
              onChange={event => this.setState({ mockupName: event.target.value })}
            />
            <Button onClick={() => this.props.createNewMockup(this.state.mockupName)}>Create</Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }

  renderMockup(mockup) {
    return (
      <List.Item key={mockup.id}>
        <List.Content floated="right">
          <Button>View</Button>
        </List.Content>
        <List.Content floated="right">
          <Button>Edit</Button>
        </List.Content>
        <List.Content>
          <h2>{mockup.name}</h2>
        </List.Content>
      </List.Item>
    );
  }
}
const mapState = state => {
  return {
    mockups: state.mockups.mockupList
  };
};
const mapDispatch = { fetchMockupList, createNewMockup };

export default connect(mapState, mapDispatch)(MockupList);
