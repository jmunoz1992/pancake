import React, { Component } from "react";
import { connect } from "react-redux";
import { Label } from "semantic-ui-react";

class LabelLabel extends Component {

    handleClick = () => {

    }

    render() {
        const { label } = this.props;
        console.log("props: ", this.props);
        return (
            <Label as="a" tag key={label.id} style={{ backgroundColor: `#${label.color}` }}>
                {label.name}
            </Label>
        );
    }
}

export default LabelLabel;

