import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Textbox, Button, Checkbox } from './elements';
import Rnd from 'react-rnd';

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
    // return <div className={this.props.className}>{this.pickElement()}</div>;
    return (
      <Rnd
        className={this.props.className}
        size={{ width: this.state.width, height: this.state.height }}
        position={{ x: this.state.x, y: this.state.y }}
        onDragStop={this.onDragStop}
        onResize={this.onResize}>
        {this.renderElement()}
      </Rnd>
    );
  }

  renderElement() {
    const Element = this.pickElement();
    return (
      <ClickInterceptor>
        <Element />
      </ClickInterceptor>
    );
  }

  pickElement() {
    switch (this.props.elementData.type) {
      case Textbox.TYPE:
        return Textbox;
      case Button.TYPE:
        return Button;
      case Checkbox.TYPE:
        return Checkbox;
      default:
        throw new Error(`Invalid component type specified for ${this.props.elementData}.)`);
    }
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
  top: ${props => props.elementData.posX}px;
  left: ${({ elementData }) => elementData.posX}px;
  border: 1px solid black;
  overflow: hidden;
`;

export default StyledWireframeElement;
