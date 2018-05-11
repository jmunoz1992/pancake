import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, Form } from "semantic-ui-react";

class EditPullRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { pullRequest } = this.props;
    return (
      <Modal.Content>
        <h1 style={{ width: "100px", display: "inline" }}>
          Pull Request #{pullRequest.number}: {pullRequest.title}
        </h1>
        <br />
        <br />

        <Form>
          <Form.Field>
            <label>{pullRequest.body}</label>
          </Form.Field>
        </Form>
      </Modal.Content>
    );
  }
}

const mapState = () => {
  return {};
};

const mapDispatch = {};

export default connect(mapState, mapDispatch)(EditPullRequest);
