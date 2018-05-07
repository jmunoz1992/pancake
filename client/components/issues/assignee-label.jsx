import React from "react";
import { Label, Icon } from "semantic-ui-react";

const AssigneeLabel = (props) => {
    const assignee = props.assignee;
    return (
        <Label as="a" image key={assignee.id} >
            <img src={assignee.avatar_url} />
            {assignee.login}
            <Icon name="delete" />
        </Label>
    );
};

export default AssigneeLabel;
