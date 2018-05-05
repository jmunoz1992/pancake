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

  onDragStop = (_, positionInfo) => {
    this.props.doMoveElement(positionInfo.x - this.props.offset.x, positionInfo.y - this.props.offset.y);
  };

  onResizeStop = (...eventArgs) => {
    const sizeDelta = eventArgs[3];
    const width = this.props.element.width + sizeDelta.width;
    const height = this.props.element.height + sizeDelta.height;
    this.props.doResizeElement(height, width);
  };

  onElementClicked = event => {
    if (!this.props.selected) {
      !this.props.selected && this.props.doSelectElement();
    }
  };

  render() {
    return this.props.selected ? this.renderSelected() : this.renderUnselected();
  }

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

  renderUnselected() {
    return (
      <div className={this.props.className} style={this.props.style} onClick={this.onElementClicked}>
        {this.renderElement()}
      </div>
    );
  }

  renderElement() {
    const ElementToRender = Object.getPrototypeOf(this.props.element).constructor.COMPONENT;
    return (
      <ClickInterceptor>
        <ElementToRender />
      </ClickInterceptor>
    );
  }

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
