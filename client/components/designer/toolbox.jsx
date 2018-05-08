import React, { Component } from "react";
import { default as Library } from "./elements";
import { designerOperations } from "../../store";
import { connect } from "react-redux";

class Toolbox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3>Toolbox</h3>
        {this.renderLibraryComponents()}
      </div>
    );
  }

  onToolboxElementClicked(element) {
    this.props.addElement(element);
  }

  renderLibraryComponents() {
    const libraryArray = Object.values(Library);

    return libraryArray.map(element => {
      const ComponentToRender = element.COMPONENT;
      return (
        <div key={element.name} onClick={() => this.onToolboxElementClicked(element)}>
          <ComponentToRender />
        </div>
      );
    });
  }
}

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const mapDispatch = dispatch => {
  return {
    addElement: ElementClass => {
      const element = new ElementClass();
      element.top = getRandomIntInclusive(100, 1000);
      element.left = getRandomIntInclusive(100, 1000);
      dispatch(designerOperations.createNewElement(element));
    }
  };
};

export default connect(null, mapDispatch)(Toolbox);
