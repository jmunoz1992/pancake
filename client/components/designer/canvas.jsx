import React, { Component } from "react";
import styled from "styled-components";
import { Header, Icon, Dimmer, Loader } from "semantic-ui-react";
import { default as DesignerElement } from "./element";
import { designerOperations } from "../../store";
import { connect } from "react-redux";
import Toolbar from "./toolbar";

class DesignerCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panOffsetX: 0,
      panOffsetY: 0,
      dragging: false,
      ignoreNextClick: false,
      editMode: false
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
    this.props.disconnect();
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  }

  // Hook scrollwheel event to move the canvas around
  onScroll = event => {
    event.preventDefault();
    this.setState({
      panOffsetX: this.state.panOffsetX - event.deltaX,
      panOffsetY: this.state.panOffsetY - event.deltaY
    });
  };

  // Keyboard shortcuts
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
      const deltaX = event.pageX - this.state.dragLastX;
      const deltaY = event.pageY - this.state.dragLastY;
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

  // ignoreNextClick is set after a drag event, since drag events fire unwanted onClicks.
  onCanvasClicked = event => {
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
        onWheel={this.onScroll}
        onClick={this.onCanvasClicked}
        tabIndex="0"
        className={"noselect"}
        gridOffset={{ x: this.state.panOffsetX, y: this.state.panOffsetY }}>
        {this.props.elements.map(element => (
          <DesignerElement
            key={element.id}
            element={element}
            selected={element.id === this.props.selectedElementId}
            offset={{ x: this.state.panOffsetX, y: this.state.panOffsetY }}
          />
        ))}
        <Toolbar />
      </StyledCanvas>
    );
  }
}

// StyledComponents suggests using `attrs` for properties that are updated many times per second,
// such as when we're animating the background grid lines while the user drags the canvas around
const StyledCanvas = styled.div.attrs({
  style: ({ gridOffset }) => ({
    backgroundPosition: `${gridOffset.x - 1}px ${gridOffset.y - 1}px`
  })
})`
  background-size: 40px 40px;
  background-image: linear-gradient(to right, silver 1px, transparent 1px),
    linear-gradient(to bottom, silver 1px, transparent 1px);
  background-color: whitesmoke;
  width: 100%;
  height: 100%;
  touch-action: none;
`;

const mapState = state => {
  const selectedElement = state.designer.elements.find(
    element => element.id === state.designer.selectedElement
  );
  return {
    selectedMockupId: state.mockups.selectedMockup,
    elements: state.designer.elements,
    selectedElement,
    selectedElementId: state.designer.selectedElement
  };
};

const mapDispatch = dispatch => {
  return {
    loadMockup: () => dispatch(designerOperations.loadMockup()),
    disconnect: () => dispatch(designerOperations.disconnect()),
    doMoveElement: (element, x, y) => dispatch(designerOperations.moveElement(element, { x, y })),
    deleteElement: elementId => dispatch(designerOperations.deleteElement({ id: elementId })),
    deselect: () => dispatch(designerOperations.selectElement({ id: 0 }))
  };
};

export default connect(mapState, mapDispatch)(DesignerCanvas);
