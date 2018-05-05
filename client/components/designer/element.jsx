import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Rnd from "react-rnd";

class WireframeElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 200,
      height: 200,
      x: 0,
      y: 0
    };
  }

  onDragStop = (event, d) => {
    this.setState({ x: d.x, y: d.y });
  };

  onResize = (e, direction, ref, delta, position) => {
    this.setState({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      ...position
    });
  };

  render() {
    console.log("Element props:", this.props.element);
    return (
      <Rnd
        className={this.props.className}
        default={{
          x: this.props.element.left,
          y: this.props.element.top,
          width: this.props.element.width,
          height: this.props.element.height
        }}
        onDragStop={this.onDragStop}
        onResize={this.onResize}>
        {this.renderElement()}
      </Rnd>
    );
  }

  renderElement() {
    const ElementToRender = Object.getPrototypeOf(this.props.element).constructor.COMPONENT;
    console.log("Component:", ElementToRender);
    return (
      <ClickInterceptor>
        <ElementToRender />
      </ClickInterceptor>
    );
  }
}

const ClickInterceptor = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: transparent;
`;

const StyledWireframeElement = styled(WireframeElement)`
  position: absolute;
  top: ${({ element }) => element.top}px;
  left: ${({ element }) => element.left}px;
  border: 1px solid black;
  overflow: hidden;
`;

export default StyledWireframeElement;
