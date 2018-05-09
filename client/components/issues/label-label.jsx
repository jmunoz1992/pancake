import React, { Component } from "react";
import { connect } from "react-redux";
import { Label } from "semantic-ui-react";
import { removeLabel } from "../../store/issues";

class LabelLabel extends Component {

    handleClick = () => {
        this.props.removeLabel(this.props.issue.number, this.props.label, this.props.issue.id);
    }

    render() {
        const { label } = this.props;
        return (
            <Label
                as="a" tag
                key={label.id}
                onClick={this.handleClick}
                style={{ backgroundColor: `#${label.color}` }}
            >
                {label.name}
            </Label>
        );
    }
}

const mapState = null;

const mapDispatch = { removeLabel };

export default connect(mapState, mapDispatch)(LabelLabel);
