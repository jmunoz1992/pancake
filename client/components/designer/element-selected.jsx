import React, { Component } from "react";
import { connect } from "react-redux";
import Rnd from "react-rnd";
import { default as ElementLibrary } from "./elements";
import { designerOperations } from "../../store";

class DraggableElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.rnd = React.createRef();
  }

  // Handles arrow key nudging events, which come from the parent
  componentWillReceiveProps = props => {
    if (this.rnd.current) {
      this.rnd.current.updatePosition({
        x: this.props.element.left + this.props.offset.x,
        y: this.props.element.top + this.props.offset.y
      });
    }
  };

  // We only update the Redux store with the new size or position of an element when the user
  // finishes dragging. React-RnD takes care of keeping track of the element's size and position in
  // the meantime.
  onDragStop = (...args) => {
    const positionInfo = args[1];
    let deltaX = this.props.element.left - positionInfo.x + this.props.offset.x;
    let deltaY = this.props.element.top - positionInfo.y + this.props.offset.y;
    deltaX = Math.round(deltaX / 5) * 5; // Round to the nearest 5 for grid snapping
    deltaY = Math.round(deltaY / 5) * 5;
    this.props.doMoveElement(deltaX, deltaY);
  };

  onResizeStop = (...eventArgs) => {
    const sizeDelta = eventArgs[3];
    const coords = eventArgs[4];
    const width = this.props.element.width + sizeDelta.width;
    const height = this.props.element.height + sizeDelta.height;
    this.props.doResizeElement(height, width, coords.x - this.props.offset.x, coords.y - this.props.offset.y);
  };

  // For selected elements, we wrap the mockup component in a <Rnd> component, which makes
  // whatever component it wraps draggable and resizeable.  After the user stops dragging, we
  // update the Redux store in our event handlers, and we receive new props from our parent, which
  // Rnd uses to set the new default position of the component.
  render() {
    const { MIN_HEIGHT, MAX_HEIGHT, MIN_WIDTH, MAX_WIDTH } = this.getElementConstraints();
    return (
      <Rnd
        style={this.props.style}
        ref={this.rnd}
        default={{
          x: this.props.element.left + this.props.offset.x,
          y: this.props.element.top + this.props.offset.y,
          width: this.props.element.width,
          height: this.props.element.height
        }}
        z={this.props.element.zIndex}
        bounds={"parent"}
        dragGrid={[5, 5]}
        minHeight={MIN_HEIGHT}
        maxHeight={MAX_HEIGHT}
        minWidth={MIN_WIDTH}
        maxWidth={MAX_WIDTH}
        onDragStop={this.onDragStop}
        onResizeStop={this.onResizeStop}>
        {this.props.children}
      </Rnd>
    );
  }
  // This is a helper function to grab the min/max size constants for an element, which are static
  // properties defined in the ElementLibrary.
  getElementConstraints() {
    const elementClass = ElementLibrary[this.props.element.type].element;
    return {
      MIN_HEIGHT: elementClass.MIN_HEIGHT,
      MAX_HEIGHT: elementClass.MAX_HEIGHT,
      MIN_WIDTH: elementClass.MIN_WIDTH,
      MAX_WIDTH: elementClass.MAX_WIDTH
    };
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    doResizeElement: (height, width, x, y) =>
      dispatch(designerOperations.resizeElement(ownProps.element, { height, width, x, y })),
    doMoveElement: (x, y) => dispatch(designerOperations.moveSelection({ x, y }))
  };
};

export default connect(null, mapDispatch)(DraggableElement);
