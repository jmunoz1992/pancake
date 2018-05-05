import React, { Component } from "react";
import styled from "styled-components";
import { default as DesignerElement } from "./element";
import { Textbox } from "./elements";
import { designerOperations } from "../../store";
import { connect } from "react-redux";

class DesignerCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
    for (let i = 0; i < 1; i++) {
      const textbox = this.makeRandomElement();
      textbox.top = getRandomIntInclusive(0, 500);
      textbox.left = getRandomIntInclusive(0, 500);
      this.props.addElement(textbox);
    }
    this.canvasRef = React.createRef();
  }

  makeRandomElement() {
    return new Textbox();
  }

  onCanvasClicked = event => {
    // Click events can bubble up from child components, so only call deselect() if it was actually
    // the canvas itself that was clicked.
    if (this.canvasRef.current === event.target && this.props.selectedElementId !== 0) this.props.deselect();
  };

  render() {
    return (
      <div
        ref={this.canvasRef}
        className={`noselect ${this.props.className}`}
        style={{ position: "relative" }}
        onClick={this.onCanvasClicked}>
        {this.props.elements.map(element => (
          <DesignerElement
            key={element.id}
            element={element}
            selected={element.id === this.props.selectedElementId}
          />
        ))}
      </div>
    );
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const StyledCanvas = styled(DesignerCanvas)`
  background-color: whitesmoke;
  width: 100%;
  height: 100%;
`;

const mapState = state => {
  return { elements: state.designerState.elements, selectedElementId: state.designerState.selectedElement };
};

const mapDispatch = dispatch => {
  return {
    addElement: element => dispatch(designerOperations.createNewElement(element)),
    deselect: () => {
      dispatch(designerOperations.selectElement({ id: 0 }));
    }
  };
};

export default connect(mapState, mapDispatch)(StyledCanvas);
