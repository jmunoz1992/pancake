import React, { Component } from "react";
import styled from "styled-components";
import { default as DesignerElement } from "./element";
import { designerOperations } from "../../store";
import { connect } from "react-redux";

class DesignerCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panOffsetX: 0,
      panOffsetY: 0,
      dragging: false
    };
  }

  // Event listeners for canvas panning.  They're added to the document because if we add them to
  // the canvas itself, we stop receiving mouse events if the mouse moves outside of the canvas
  componentDidMount() {
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  onMouseDown = event => {
    if (event.target.id === "wireframe-canvas" && this.props.selectedElementId === 0) {
      this.setState({
        dragging: true,
        dragLastX: event.pageX,
        dragLastY: event.pageY
      });
    }
  };

  onMouseMove = event => {
    if (this.state.dragging) {
      const deltaX = event.pageX - this.state.dragLastX;
      const deltaY = event.pageY - this.state.dragLastY;
      this.setState({
        panOffsetX: this.state.panOffsetX + deltaX,
        panOffsetY: this.state.panOffsetY + deltaY,
        dragLastX: event.pageX,
        dragLastY: event.pageY
      });
    }
  };

  onMouseUp = _ => {
    if (this.state.dragging) {
      this.setState({ dragging: false, dragLastX: 0, dragLastY: 0 });
    }
  };

  onCanvasClicked = event => {
    // Click events can bubble up from child components, so only call deselect() if it was actually
    // the canvas itself that was clicked.
    if (event.target.id === "wireframe-canvas" && this.props.selectedElementId !== 0) this.props.deselect();
  };

  render() {
    return (
      <StyledCanvas
        id="wireframe-canvas"
        className={"noselect"}
        onClick={this.onCanvasClicked}
        gridOffset={{ x: this.state.panOffsetX, y: this.state.panOffsetY }}>
        {this.props.elements.map(element => (
          <DesignerElement
            key={element.id}
            element={element}
            selected={element.id === this.props.selectedElementId}
            offset={{ x: this.state.panOffsetX, y: this.state.panOffsetY }}
          />
        ))}
      </StyledCanvas>
    );
  }
}

// StyledComponents suggests using `attrs` for properties that are updated many times per second,
// such as when we're animating the canvas grid lines while the user drags the canvas around
const StyledCanvas = styled.div.attrs({
  style: ({ gridOffset }) => ({
    backgroundPosition: `${gridOffset.x}px ${gridOffset.y}px`
  })
})`
  background-size: 40px 40px;
  background-image: linear-gradient(to right, silver 1px, transparent 1px),
    linear-gradient(to bottom, silver 1px, transparent 1px);
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

export default connect(mapState, mapDispatch)(DesignerCanvas);
