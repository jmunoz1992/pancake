import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Rnd from "react-rnd";
import { designerOperations } from "../../store";

class WireframeElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // We only update the Redux store with the new size or position of an element when the user
  // finishes dragging. React-RnD takes care of keeping track of the element's size and position in
  // the meantime.
  onDragStop = (event, positionInfo) => {
    this.props.doMoveElement(positionInfo.x - this.props.offset.x, positionInfo.y - this.props.offset.y);
  };

  onResizeStop = (...eventArgs) => {
    const sizeDelta = eventArgs[3];
    const width = this.props.element.width + sizeDelta.width;
    const height = this.props.element.height + sizeDelta.height;
    this.props.doResizeElement(height, width);
  };

  onElementClicked = _ => {
    if (!this.props.selected) {
      !this.props.selected && this.props.doSelectElement();
    }
  };

  render() {
    return this.props.selected ? this.renderSelected() : this.renderUnselected();
  }

  // If the element is selected, we wrap the mockup component in a <Rnd> component. Rnd makes
  // whatever component it wraps draggable and resizeable.  After the user stops dragging, we
  // update the Redux store in our event handlers, and we receive new props from our parent, which
  // Rnd uses to set the new default position of the component.
  renderSelected() {
    return (
      <Rnd
        className={this.props.className}
        default={{
          x: this.props.element.left + this.props.offset.x,
          y: this.props.element.top + this.props.offset.y,
          width: this.props.element.width,
          height: this.props.element.height
        }}
        bounds={"parent"}
        minHeight={this.getElementConstraints().MIN_HEIGHT}
        maxHeight={this.getElementConstraints().MAX_HEIGHT}
        minWidth={this.getElementConstraints().MIN_WIDTH}
        maxWidth={this.getElementConstraints().MAX_WIDTH}
        onDragStop={this.onDragStop}
        onResizeStop={this.onResizeStop}>
        {this.renderElement()}
      </Rnd>
    );
  }

  // If the element isn't selected, we wrap it with a div and pass in style/CSS props received
  // from the StyledComponents wrapper
  renderUnselected() {
    return (
      <div className={this.props.className} style={this.props.style} onClick={this.onElementClicked}>
        {this.renderElement()}
      </div>
    );
  }

  // this.props.element contains the mockup `Element` we need to render, which is defined in the
  // ./elements folder.  There's a static property on each Element object called `COMPONENT`,
  // which is the actual React component the Element represents.  Static methods are located on the
  // prototype's constructor, so we need to use Object.getPrototypeOf().constructor to access them.
  renderElement() {
    const ElementToRender = Object.getPrototypeOf(this.props.element).constructor.COMPONENT;
    return (
      // ClickInterceptor is an invisible overlay that stops mouse events, so the user doesn't
      // accidentally click on textboxes or buttons while trying to drag a mockup element around
      <ClickInterceptor>
        <ElementToRender />
      </ClickInterceptor>
    );
  }

  // This is a helper function to grab the min/max size constants for an element, which are static
  // properties defined on their constructor.
  getElementConstraints() {
    const { MIN_HEIGHT, MAX_HEIGHT, MIN_WIDTH, MAX_WIDTH } = Object.getPrototypeOf(
      this.props.element
    ).constructor;
    return { MIN_HEIGHT, MAX_HEIGHT, MIN_WIDTH, MAX_WIDTH };
  }
}

const ClickInterceptor = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: transparent;
`;

// StyledComponents warns against putting frequently modified styles (like position while the user
// is dragging an element around) inside of the template string and instead suggests using `attrs`.
const StyledWireframeElement = styled(WireframeElement).attrs({
  style: ({ element, offset }) => ({
    transform: `translate(${element.left + offset.x}px, ${element.top + offset.y}px)`,
    width: `${element.width}px`,
    height: `${element.height}px`
  })
})`
  position: absolute;
  outline: ${({ selected }) => (selected ? "1px solid black" : "none")};
  background-color: ${({ selected }) => (selected ? "#EAEAEA" : "transparent")};
  overflow: hidden;
`;

const mapDispatch = (dispatch, ownProps) => {
  return {
    doSelectElement: () => dispatch(designerOperations.selectElement(ownProps.element)),
    doResizeElement: (height, width) =>
      dispatch(designerOperations.resizeElement(ownProps.element, { height, width })),
    doMoveElement: (x, y) => dispatch(designerOperations.moveElement(ownProps.element, { x, y }))
  };
};

export default connect(null, mapDispatch)(StyledWireframeElement);
