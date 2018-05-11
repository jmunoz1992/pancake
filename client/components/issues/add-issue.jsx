import React, { Component } from "react";
import { Button, Divider, Icon, Modal } from "semantic-ui-react";

class AddIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
        };
    }
    openModal = () => { this.setState({ modalOpen: true }); }
    cancel = () => { this.setState({ modalOpen: false }); }

    render() {
        return (
            <div>
                <Divider />
                <h1 style={{ width: "100px", display: "inline" }}>Issues</h1>
                <Button floated="right" onClick={this.openModal}>New Issue</Button>
                <Modal open={this.state.modalOpen}>
                    <Modal.Actions>
                        <Button color="green" onClick={this.onSubmit}>
                            <Icon name="checkmark" /> Submit
                        </Button>
                        <Button color="red" onClick={this.cancel}>
                            <Icon name="checkmark" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

export default AddIssue;
