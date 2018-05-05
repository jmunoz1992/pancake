import React, { Component } from "react";
import styled from "styled-components";
import { default as DesignerElement } from "./element";
import { Textbox } from "./elements";

class DesignerCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: []
    };
    for (let i = 0; i < 5; i++) {
      const textbox = this.makeRandomElement();
      textbox.top = getRandomIntInclusive(0, 500);
      textbox.left = getRandomIntInclusive(0, 500);
      this.state.elements.push(textbox);
    }
  }

  makeRandomElement() {
    return new Textbox();
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.state.elements.map((element, index) => <DesignerElement key={index} element={element} />)}
      </div>
    );
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const StyledCanvas = styled(DesignerCanvas)`
  background-color: whitesmoke;
  width: 100%;
  height: 100%;
`;

export default StyledCanvas;
