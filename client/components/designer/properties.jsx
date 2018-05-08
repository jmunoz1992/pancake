import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button } from "semantic-ui-react";
import { designerOperations } from "../../store";

class Properties extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const StyledDiv = styled.div`
      height: 50%;
      overflow-y: scroll;
    `;
    return (
      <StyledDiv>
        <h1>Properties</h1>
        {this.props.element ? this.renderElementProperties() : <p>Nothing selected.</p>}
      </StyledDiv>
    );
  }

  renderElementProperties() {
    return (
      <div>
        <p style={{ wordWrap: "break-word" }}>
          Selected Element:<br />
          {JSON.stringify(this.props.element)}
        </p>
        <Button negative onClick={() => this.props.deleteElement(this.props.element)}>
          Delete Element
        </Button>
      </div>
    );
  }
}

const mapState = state => {
  const { selectedElement, elements } = state.designerState;
  const selectedElementObj = elements.find(e => e.id === selectedElement);
  return { element: selectedElementObj };
};

const mapDispatch = dispatch => ({
  deleteElement: element => dispatch(designerOperations.deleteElement(element))
});

export default connect(mapState, mapDispatch)(Properties);
