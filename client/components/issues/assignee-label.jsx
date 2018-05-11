import React from "react";
import { connect } from "react-redux";
import { Label, Icon } from "semantic-ui-react";

const AssigneeLabel = props => {
    const assignee = props.assignee;
    return (
        <Label
            as="a"
            image
            key={assignee.id}
        >
            <img src={assignee.avatar_url} />
            {assignee.login}
            <Icon name="delete" />
        </Label>
    );
};

const mapStateToProps = ({ collaborators }, ownProps) => {
    const assignee = collaborators.filter(collaborator => collaborator.login === ownProps.login)[0];
    return { assignee };
};

export default connect(mapStateToProps, null)(AssigneeLabel);
