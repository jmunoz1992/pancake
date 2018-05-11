import React from "react";
import { connect } from "react-redux";
import { Icon, Label } from "semantic-ui-react";

const LabelLabel = props => {
    const { label } = props;
    return (
        <Label
            as="a" tag
            key={label.id}
            style={{ backgroundColor: `#${label.color}` }}
        >
            {label.name}
            <Icon name="delete" />
        </Label>
    );
};

const mapStateToProps = ({ labels }, ownProps) => {
    const label = labels.filter(currLabel => currLabel.name === ownProps.name)[0];
    return { label };
};

export default connect(mapStateToProps, null)(LabelLabel);
