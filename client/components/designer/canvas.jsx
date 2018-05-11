import React, { Component } from "react";
import styled from "styled-components";
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
      editMode: false,
      shiftDown: false,
      boxSelectionStart: [],
      boxSelectionPoints: {}
    };
    this.ref = React.createRef();
  }

  // Event listeners for canvas panning.  They're added to the document because if we add them to
  // the canvas itself, we stop receiving mouse events if the mouse moves outside of the canvas
  componentDidMount() {
    document.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("keydown", this.onShiftDown);
    document.addEventListener("keyup", this.onShiftUp);
  }

  componentWillUnmount() {
    this.props.disconnect();
    document.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("keydown", this.onShiftDown);
    document.removeEventListener("keyup", this.onShiftUp);
  }

  onShiftDown = ({ keyCode }) => keyCode === 16 && this.setState({ shiftDown: true });
  onShiftUp = ({ keyCode }) => {
    if (keyCode === 16) {
      this.setState({ shiftDown: false });
      if (this.state.shiftDown) this.getBoxElementIntersection(this.state.boxSelectionPoints);
    }
  };

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
    const { editMode, selectedElements } = this.props;
    if (editMode && selectedElements.length) {
      this.keycodeHandler(event.keyCode);
    }
  };

  keycodeHandler = code => {
    switch (code) {
      case 8: // Backspace
      case 46: // Delete
        this.props.deleteElements();
        break;
      // case 37: //Left
      //   this.props.doMoveElement(element, element.left - 1, element.top);
      //   break;
      // case 38: //Up
      //   this.props.doMoveElement(element, element.left, element.top - 1);
      //   break;
      // case 39: //Right
      //   this.props.doMoveElement(element, element.left + 1, element.top);
      //   break;
      // case 40: // Down
      //   this.props.doMoveElement(element, element.left, element.top + 1);
      //   break;
      default:
        break;
    }
  };

  onMouseDown = event => {
    if (event.target.id === "mockup-canvas" && event.button === 0) {
      if (this.state.shiftDown) {
        const rect = this.ref.current.getBoundingClientRect(); //Account for div's position on page
        const points = { x: event.clientX - rect.x, y: event.clientY - rect.y };
        console.log("points", points, "event", event);
        this.setState({
          boxSelectionStart: [points.x, points.y],
          boxSelectionPoints: { top: points.y, left: points.x, width: 0, height: 0 }
        });
      } else {
        this.setState({
          dragging: true,
          dragLastX: event.pageX,
          dragLastY: event.pageY
        });
      }
    }
  };

  onMouseMove = event => {
    if (this.state.dragging) this.panCanvas(event);
    if (this.state.boxSelectionStart.length) this.drawBox(event);
  };

  panCanvas = event => {
    const deltaX = event.clientX - this.state.dragLastX;
    const deltaY = event.clientY - this.state.dragLastY;
    this.setState({
      panOffsetX: this.state.panOffsetX + deltaX,
      panOffsetY: this.state.panOffsetY + deltaY,
      dragLastX: event.pageX,
      dragLastY: event.pageY,
      ignoreNextClick: true
    });
  };

  drawBox(event) {
    const startX = this.state.boxSelectionStart[0];
    const startY = this.state.boxSelectionStart[1];
    const rect = this.ref.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.x;
    const mouseY = event.clientY - rect.y;
    let box = {};

    if (mouseX < startX) box = { left: mouseX, width: startX - mouseX };
    else box = { left: startX, width: mouseX - startX };

    if (mouseY < startY) box = { ...box, top: mouseY, height: startY - mouseY };
    else box = { ...box, top: startY, height: mouseY - startY };
    this.setState({ boxSelectionPoints: box, ignoreNextClick: true });
  }

  onMouseUp = _ => {
    if (this.state.dragging) {
      this.setState({ dragging: false, dragLastX: 0, dragLastY: 0 });
    } else if (this.state.boxSelectionStart.length) {
      this.getBoxElementIntersection(this.state.boxSelectionPoints);
    }
  };

  getBoxElementIntersection = box => {
    this.setState({ boxSelectionStart: [] });
    const boxLeft = { x: box.left - this.state.panOffsetX, y: box.top - this.state.panOffsetY };
    const boxRight = {
      x: box.left + box.width - this.state.panOffsetX,
      y: box.top + box.height - this.state.panOffsetY
    };
    const selectedElements = [];
    this.props.elements.forEach(element => {
      const elementLeft = { x: element.left, y: element.top };
      const elementRight = { x: element.left + element.width, y: element.top + element.height };
      if (boxLeft.x > elementRight.x || elementLeft.x > boxRight.x) return;
      if (boxLeft.y > elementRight.y || elementLeft.y > boxRight.y) return;
      selectedElements.push(element.id);
    });
    this.props.selectElements(selectedElements);
  };

  // ignoreNextClick is set after a drag event, since drag events fire unwanted onClicks.
  onCanvasClicked = event => {
    if (
      this.props.editMode &&
      event.target.id === "mockup-canvas" &&
      this.props.selectedElements.length &&
      !this.state.ignoreNextClick
    ) this.props.deselect();
    this.setState({ ignoreNextClick: false });
  };

  render() {
    return (
      <StyledCanvas
        innerRef={this.ref}
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
            editMode={this.props.editMode}
            shiftDown={this.state.shiftDown}
            selected={this.props.selectedElements.indexOf(element.id) !== -1}
            offset={{ x: this.state.panOffsetX, y: this.state.panOffsetY }}
          />
        ))}
        <Toolbar />
        {this.state.boxSelectionStart.length ? <BoxSelection points={this.state.boxSelectionPoints} /> : null}
      </StyledCanvas>
    );
  }
}

const BoxSelection = styled.div.attrs({
  style: ({ points }) => ({
    top: points.top,
    left: points.left,
    height: points.height,
    width: points.width
  })
})`
  /* margin-left: 10px; */
  position: absolute;
  border: 1px solid blue;
  background: #0000ff44;
  z-index: 1000;
`;

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
    editMode: state.designer.config.editMode,
    selectedMockupId: state.mockups.selectedMockup,
    elements: state.designer.elements,
    selectedElements: state.designer.selectedElements
  };
};

const mapDispatch = dispatch => {
  return {
    loadMockup: () => dispatch(designerOperations.loadMockup()),
    disconnect: () => dispatch(designerOperations.disconnect()),
    selectElements: elements => dispatch(designerOperations.selectElements(elements)),
    doMoveSelection: (x, y) => dispatch(designerOperations.moveSelection({ x, y })),
    deleteElements: () => dispatch(designerOperations.deleteElements()),
    deselect: () => dispatch(designerOperations.selectElements([]))
  };
};

export default connect(mapState, mapDispatch)(DesignerCanvas);
