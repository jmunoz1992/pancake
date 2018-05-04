import React, { Component } from 'react';
import styled from 'styled-components';
import { default as DesignerElement } from './element';

class DesignerCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: [this.makeRandomElement(), this.makeRandomElement(), this.makeRandomElement()]
    };
  }

  makeRandomElement() {
    return {
      type: 'forms/textbox',
      posX: getRandomIntInclusive(0, 500),
      posY: getRandomIntInclusive(0, 500)
    };
  }

  render() {
    return (
      <div className={this.props.className} data-attr="test">
        {this.state.elements.map(data => <DesignerElement key={Math.random()} elementData={data} />)}
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
  width: 800px;
  height: 800px;
`;

export default StyledCanvas;
