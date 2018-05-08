import React, { Component } from "react";
import styled from "styled-components";
import { Header, Icon, Dimmer, Loader } from "semantic-ui-react";
import { default as DesignerElement } from "./element";
import { designerOperations } from "../../store";
import { connect } from "react-redux";

class DesignerCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panOffsetX: 0,
      panOffsetY: 0,
      zoomLevel: 1,
      dragging: false,
      ignoreNextClick: false
    };
  }

  // Event listeners for canvas panning.  They're added to the document because if we add them to
  // the canvas itself, we stop receiving mouse events if the mouse moves outside of the canvas
  componentDidMount() {
    console.log("Canvas mounting.");
    this.props.loadMockup(2);
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    // document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    console.log("Canvas unmounting.");
    this.props.disconnect(2);
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    // document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown = event => {
    console.log("KeyCode", event.keyCode);
    if (this.props.selectedElementId !== 0) {
      const element = this.props.selectedElement;
      switch (event.keyCode) {
        case 8: // Backspace
        case 46: // Delete
          this.props.deleteElement(this.props.selectedElementId);
          break;
        case 37: //Left
          this.props.doMoveElement(element, element.left - 1, element.top);
          break;
        case 38: //Up
          this.props.doMoveElement(element, element.left, element.top - 1);
          break;
        case 39: //Right
          this.props.doMoveElement(element, element.left + 1, element.top);
          break;
        case 40: // Down
          this.props.doMoveElement(element, element.left, element.top + 1);
          break;
        default:
          break;
      }
    }
  };

  onMouseDown = event => {
    if (event.target.id === "mockup-canvas" && event.button === 0) {
      this.setState({
        dragging: true,
        dragLastX: event.pageX,
        dragLastY: event.pageY
      });
    }
  };

  onMouseMove = event => {
    if (this.state.dragging) {
      const zoomAdjustment = 1 / this.state.zoomLevel;
      const deltaX = (event.pageX - this.state.dragLastX) * zoomAdjustment;
      const deltaY = (event.pageY - this.state.dragLastY) * zoomAdjustment;
      this.setState({
        panOffsetX: this.state.panOffsetX + deltaX,
        panOffsetY: this.state.panOffsetY + deltaY,
        dragLastX: event.pageX,
        dragLastY: event.pageY,
        ignoreNextClick: true
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
    if (
      event.target.id === "mockup-canvas" &&
      this.props.selectedElementId !== 0 &&
      !this.state.ignoreNextClick
    ) this.props.deselect();
    this.setState({ ignoreNextClick: false });
  };

  render() {
    return (
      <StyledCanvas
        id="mockup-canvas"
        onKeyDown={this.onKeyDown}
        tabIndex="0"
        className={"noselect"}
        onClick={this.onCanvasClicked}
        zoomLevel={this.state.zoomLevel}
        gridOffset={{ x: this.state.panOffsetX, y: this.state.panOffsetY }}>
        {this.props.elements.map(element => (
          <DesignerElement
            key={element.id}
            element={element}
            selected={element.id === this.props.selectedElementId}
            offset={{ x: this.state.panOffsetX, y: this.state.panOffsetY }}
            zoom={{}}
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
  transform: scale(${props => props.zoomLevel});
`;

const mapState = state => {
  const selectedElement = state.designerState.elements.find(
    element => element.id === state.designerState.selectedElement
  );
  return {
    elements: state.designerState.elements,
    selectedElement,
    selectedElementId: state.designerState.selectedElement
  };
};

const mapDispatch = dispatch => {
  return {
    loadMockup: mockupId => dispatch(designerOperations.loadMockup(mockupId)),
    disconnect: mockupId => dispatch(designerOperations.disconnect(mockupId)),
    doMoveElement: (element, x, y) => dispatch(designerOperations.moveElement(element, { x, y })),
    deleteElement: elementId => dispatch(designerOperations.deleteElement({ id: elementId })),
    deselect: () => dispatch(designerOperations.selectElement({ id: 0 }))
  };
};

export default connect(mapState, mapDispatch)(DesignerCanvas);
