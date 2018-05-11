import React, { Component } from "react";
import { connect } from "react-redux";
import Rnd from "react-rnd";
import { default as ElementLibrary } from "./elements";
import { designerOperations } from "../../store";
import { ElementComponentWrapper } from "./element-wrapper";

class SelectionWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.rnd = React.createRef();
  }

  style = {
    position: "absolute",
    outline: "1px solid black",
    backgroundColor: "#EAEAEABB"
    // overflow: "hidden"
  };

  // Handles arrow key nudging events, which come from the parent
  componentWillReceiveProps = newProps => {
    if (newProps.shiftDown) {
      // this.style.backgroundColor = "#EAEAEA66";
      this.style.opacity = 0.8;
      this.style.pointerEvents = "none";
    } else {
      // this.style.backgroundColor = "#EAEAEADD";
      delete this.style.pointerEvents;
      this.style.opacity = 1;
    }
    if (this.props.offset !== newProps.offset || this.props.elements !== newProps.elements) {
      this.rnd.current.updatePosition({
        x: newProps.bounds.left + newProps.offset.x,
        y: newProps.bounds.top + newProps.offset.y
      });
      this.rnd.current.updateSize({
        width: newProps.bounds.width,
        height: newProps.bounds.height
      });
    }
  };

  // We only update the Redux store with the new size or position of an element when the user
  // finishes dragging. React-RnD takes care of keeping track of the element's size and position in
  // the meantime.
  onDragStop = (...args) => {
    const positionInfo = args[1];
    let deltaX = this.props.bounds.left - positionInfo.x + this.props.offset.x;
    let deltaY = this.props.bounds.top - positionInfo.y + this.props.offset.y;
    deltaX = Math.round(deltaX / 5) * 5; // Round to the nearest 5 for grid snapping
    deltaY = Math.round(deltaY / 5) * 5;
    this.rnd.current.updatePosition({
      x: this.props.bounds.left + this.props.offset.x - deltaX,
      y: this.props.bounds.top + this.props.offset.y - deltaY
    });
    this.props.doMoveElement(deltaX, deltaY);
  };

  onResizeStop = (...eventArgs) => {
    const sizeDelta = eventArgs[3];
    const coords = eventArgs[4];
    const width = this.props.elements[0].width + sizeDelta.width;
    const height = this.props.elements[0].height + sizeDelta.height;

    this.props.doResizeElement(height, width, coords.x - this.props.offset.x, coords.y - this.props.offset.y);
  };

  renderSingleElement() {
    const { MIN_HEIGHT, MAX_HEIGHT, MIN_WIDTH, MAX_WIDTH } = this.getElementConstraints();
    return (
      <Rnd
        key="single"
        style={this.style}
        ref={this.rnd}
        default={{
          x: this.props.elements[0].left + this.props.offset.x,
          y: this.props.elements[0].top + this.props.offset.y,
          width: this.props.elements[0].width,
          height: this.props.elements[0].height
        }}
        z={5000}
        bounds={"parent"}
        dragGrid={[5, 5]}
        minHeight={MIN_HEIGHT}
        maxHeight={MAX_HEIGHT}
        minWidth={MIN_WIDTH}
        maxWidth={MAX_WIDTH}
        resizeHandleClasses={{
          bottom: "resize-handle-fix",
          bottomLeft: "resize-handle-fix",
          bottomRight: "resize-handle-fix",
          left: "resize-handle-fix",
          right: "resize-handle-fix",
          top: "resize-handle-fix",
          topLeft: "resize-handle-fix",
          topRight: "resize-handle-fix"
        }}
        onResizeStop={this.onResizeStop}
        onDragStop={this.onDragStop}>
        {this.renderElementWrapper(this.props.elements[0])}
      </Rnd>
    );
  }

  renderMultipleElements() {
    return (
      <Rnd
        key="multiple"
        style={this.style}
        ref={this.rnd}
        default={{
          x: this.props.bounds.left + this.props.offset.x,
          y: this.props.bounds.top + this.props.offset.y,
          width: this.props.bounds.width,
          height: this.props.bounds.height
        }}
        minHeight={"0px"}
        maxHeight={"9999px"}
        minWidth={"0px"}
        maxWidth={"9999px"}
        z={5000}
        bounds={"parent"}
        dragGrid={[5, 5]}
        enableResizing={false}
        onDragStop={this.onDragStop}>
        {this.props.elements.map(element => this.renderElementWrapper(element))}
      </Rnd>
    );
  }

  renderElementWrapper(element) {
    const component = ElementLibrary[element.type].element.COMPONENT;
    return (
      <div
        key={element.id}
        style={{
          transform: `translate(${element.left - this.props.bounds.left}px, ${element.top -
            this.props.bounds.top}px)`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          zIndex: `${element.zIndex}`,
          position: "absolute",
          outline: "none",
          backgroundColor: "transparent",
          overflow: "hidden"
        }}>
        <ElementComponentWrapper component={component} element={element} />
      </div>
    );
  }

  render() {
    const { elements } = this.props;
    if (elements.length === 1) return this.renderSingleElement();
    else return this.renderMultipleElements();
  }
  // This is a helper function to grab the min/max size constants for an element, which are static
  // properties defined in the ElementLibrary.
  getElementConstraints() {
    const elementClass = ElementLibrary[this.props.elements[0].type].element;
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
      dispatch(designerOperations.resizeElement(ownProps.elements[0], { height, width, x, y })),
    doMoveElement: (x, y) => dispatch(designerOperations.moveSelection({ x, y }))
  };
};

export default connect(null, mapDispatch)(SelectionWrapper);
