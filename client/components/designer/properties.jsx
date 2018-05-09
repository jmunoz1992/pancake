import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Form, Button } from "semantic-ui-react";
import { designerOperations } from "../../store";
import { default as ElementLibrary } from "./elements";

class Properties extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={{ height: "50%", overflowY: "scroll", paddingRight: "10px" }}>
        <h2>Properties</h2>
        {this.props.element ? this.renderElementProperties() : <p>Nothing selected.</p>}
      </div>
    );
  }

  componentWillReceiveProps(props) {
    if (props.element) {
      const properties = this.getProperties.call({ props });
      properties.forEach(property => {
        this.setState({ [property]: props.element[property] });
      });
    }
  }

  onChange = event => {
    this.props.updateProperty(this.props.element, event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  getProperties() {
    const properties = Object.keys(ElementLibrary[this.props.element.type].properties);
    properties.push("name", "zIndex");
    return properties;
  }

  renderElementProperties() {
    const properties = this.getProperties();

    return (
      <div>
        <p>{`ID: ${this.props.element.id}`}</p>
        <p>{`Position: ${this.props.element.left}, ${this.props.element.top}`}</p>
        <p>{`Height: ${this.props.element.height}x${this.props.element.width}`}</p>
        <Form>
          {properties.map(property => (
            <Form.Input
              key={property}
              label={`${property}:`}
              name={property}
              onChange={this.onChange}
              value={this.state[property]}
            />
          ))}
        </Form>
        <Button negative onClick={() => this.props.deleteElement(this.props.element)}>
          Delete Element
        </Button>
      </div>
    );
  }
}

const debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this,
      args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const mapState = state => {
  const { selectedElement, elements } = state.designer;
  const selectedElementObj = elements.find(e => e.id === selectedElement);
  return { element: selectedElementObj };
};

const mapDispatch = dispatch => ({
  updateProperty: debounce((...args) => dispatch(designerOperations.updateElementProperty(...args)), 500),
  deleteElement: element => dispatch(designerOperations.deleteElement(element))
});

export default connect(mapState, mapDispatch)(Properties);
