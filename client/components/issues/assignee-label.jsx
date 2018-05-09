import React, { Component } from "react";
import { connect } from "react-redux";
import { Label, Icon } from "semantic-ui-react";
import { removeAssignee } from "../../store/issues";

class AssigneeLabel extends Component {
    removeAssignee = () => {
        this.props.removeAssignee(this.props.issue.number, [this.props.assignee.login]);
    }

    render() {
        const assignee = this.props.assignee;
        return (
            <Label
                as="a"
                image
                key={assignee.id}
                onClick={this.removeAssignee}
            >
                <img src={assignee.avatar_url} />
                {assignee.login}
                <Icon name="delete" />
            </Label>
        );
    }
}

const mapState = null;

const mapDispatch = { removeAssignee };

export default connect(mapState, mapDispatch)(AssigneeLabel);
