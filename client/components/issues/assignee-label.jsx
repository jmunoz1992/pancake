import React from "react";
import { Label } from "semantic-ui-react";

const AssigneeLabel = (props) => {
    const assignee = props.assignee;
    return (
        <Label as="a" image key={assignee.id} >
            <img src={assignee.avatar_url} />
            {assignee.login}
        </Label>
    );
};

export default AssigneeLabel;
