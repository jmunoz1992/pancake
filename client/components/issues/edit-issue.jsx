import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Divider, Form, Modal, Select } from "semantic-ui-react";

import { AssigneeLabel } from "./index";

class EditIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        this.setState({ issue: this.props.issue });
    }

    render() {
        const { issue } = this.state;
        console.log("state", this.state);
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
                        <Form.Field control={Select} label="Add Assignee" placeholder="Select" />
                        {issue.assignees.map(assignee =>
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

const mapState = ({ issues }, ownProps) => {
    return {
        issue: issues.find(issue => issue.id === ownProps.issue.id)
    };
};

export default connect(mapState)(EditIssue);
