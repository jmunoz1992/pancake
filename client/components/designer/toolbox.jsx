import React, { Component } from "react";
import { default as Library } from "./elements";
import { designerOperations } from "../../store";
import { connect } from "react-redux";
import { Accordion } from "semantic-ui-react";
import styled from "styled-components";
import ToolboxItem from "./toolboxitem";

class Toolbox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let categories = new Set();
    Object.values(Library).forEach(item => categories.add(item.category));
    categories = [...categories].map(category => ({
      title: category,
      content: {
        content: this.renderComponentsForCategory(category),
        key: `content-${category}`
      }
    }));

    return (
      <div style={{ height: "50%", overflowY: "scroll", paddingRight: "10px" }}>
        <h2>Components</h2>
        <Accordion defaultActiveIndex={-1} panels={categories} />
        {this.renderComponentsForCategory()}
      </div>
    );
  }

  onToolboxElementClicked(libraryItem) {
    this.props.addLibraryItem(libraryItem);
  }

  renderComponentsForCategory(category) {
    const libraryArray = Object.values(Library).filter(item => item.category === category);

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
      const element = new item.element();
      element.top = getRandomIntInclusive(200, 600);
      element.left = getRandomIntInclusive(200, 600);

      // Gets some default property values from the ElementLibrary item and assigns them to the new
      // component we're creating.
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
