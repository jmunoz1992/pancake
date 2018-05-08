import React, { Component } from "react";
import { default as Library } from "./elements";
import { designerOperations } from "../../store";
import { connect } from "react-redux";
import styled from "styled-components";
import ToolboxItem from "./toolboxitem";
class Toolbox extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const StyledDiv = styled.div`
      height: 50%;
      overflow-y: scroll;
    `;
    return (
      <StyledDiv>
        <h1>Toolbox</h1>
        {this.renderLibraryComponents()}
      </StyledDiv>
    );
  }

  onToolboxElementClicked(libraryItem) {
    this.props.addLibraryItem(libraryItem);
  }

  renderLibraryComponents() {
    const libraryArray = Object.values(Library);

    return libraryArray.map(item => {
      const ComponentToRender = item.element.COMPONENT;
      return (
        <ToolboxItem
          key={item.element.name}
          handleClick={() => this.onToolboxElementClicked(item)}
          item={item}
        />
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
    addLibraryItem: item => {
      console.log("toolbox addElement");
      const element = new item.element();
      element.top = getRandomIntInclusive(200, 600);
      element.left = getRandomIntInclusive(200, 600);
      for (const key in item.properties) {
        if (item.properties.hasOwnProperty(key)) {
          const value = item.properties[key];
          element[key] = value;
        }
      }
      dispatch(designerOperations.createNewElement(element));
    }
  };
};

export default connect(null, mapDispatch)(Toolbox);
