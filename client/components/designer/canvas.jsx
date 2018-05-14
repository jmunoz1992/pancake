import React, { Component } from "react";
import styled from "styled-components";
import { default as DesignerElement } from "./element";
import { designerOperations } from "../../store";
import { connect } from "react-redux";
import Toolbar from "./toolbar";
import SelectionWrapper from "./selection-wrapper";

class DesignerCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panOffsetX: 0,
      panOffsetY: 0,
      dragging: false,
      ignoreNextClick: false,
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
    const { selectedElements } = this.props;
    if (selectedElements.length) {
      this.keycodeHandler(event.keyCode);
    }
  };

  keycodeHandler = code => {
    switch (code) {
      case 8: // Backspace
      case 46: // Delete
        this.props.deleteElements();
        break;
      case 37: //Left
        this.props.nudgeSelection(1, 0);
        break;
      case 38: //Up
        this.props.nudgeSelection(0, 1);
        break;
      case 39: //Right
        this.props.nudgeSelection(-1, 0);
        break;
      case 40: // Down
        this.props.nudgeSelection(0, -1);
        break;
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

  calculateSelectionWrapperRect = selection => {
    // Generates a rectangle that contains all of the selected elements
    let boxLeft, boxRight;
    selection.forEach(element => {
      if (boxLeft && boxRight) {
        const elementLeft = { x: element.left, y: element.top };
        const elementRight = { x: element.left + element.width, y: element.top + element.height };
        if (elementLeft.x < boxLeft.x) boxLeft.x = elementLeft.x;
        if (elementLeft.y < boxLeft.y) boxLeft.y = elementLeft.y;
        if (elementRight.x > boxRight.x) boxRight.x = elementRight.x;
        if (elementRight.y > boxRight.y) boxRight.y = elementRight.y;
      } else {
        boxLeft = { x: element.left, y: element.top };
        boxRight = { x: element.left + element.width, y: element.top + element.height };
      }
    });
    let computedRect = {};

    if (boxLeft.x < boxRight.x) computedRect = { left: boxLeft.x, width: boxRight.x - boxLeft.x };
    else computedRect = { left: boxRight.x, width: boxLeft.x - boxRight.x };
    if (boxLeft.y < boxRight.y) {
      computedRect = { ...computedRect, top: boxLeft.y, height: boxRight.y - boxLeft.y };
    } else {
      computedRect = { ...computedRect, top: boxRight.y, height: boxLeft.y - boxRight.y };
    }
    return computedRect;
  };

  // ignoreNextClick is set after a drag event, since drag events fire unwanted onClicks.
  onCanvasClicked = event => {
    if (
      event.target.id === "mockup-canvas" &&
      this.props.selectedElements.length &&
      !this.state.ignoreNextClick
    ) this.props.deselect();
    this.setState({ ignoreNextClick: false });
  };

  render() {
    const idSet = new Set(this.props.selectedElements);
    let selected = [],
      unselected = [];
    this.props.elements.forEach(
      element => (idSet.has(element.id) ? selected.push(element) : unselected.push(element))
    );
    let selectionRect;
    if (selected.length) selectionRect = this.calculateSelectionWrapperRect(selected);

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
        {selected.length ? (
          <SelectionWrapper
            shiftDown={this.state.shiftDown}
            bounds={selectionRect}
            elements={selected}
            offset={{ x: this.state.panOffsetX, y: this.state.panOffsetY }}
          />
        ) : null}
        {unselected.map(element => (
          <DesignerElement
            key={element.id}
            element={element}
            shiftDown={this.state.shiftDown}
            selected={false}
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
  return {
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
    nudgeSelection: (x, y) => dispatch(designerOperations.moveSelection({ x, y })),
    deleteElements: () => dispatch(designerOperations.deleteElements()),
    deselect: () => dispatch(designerOperations.selectElements([]))
  };
};

export default connect(mapState, mapDispatch)(DesignerCanvas);
