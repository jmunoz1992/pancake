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
      const properties = ElementLibrary[props.element.type].properties;
      Object.keys(properties).forEach(property => {
        this.setState({ [property]: props.element[property] });
      });
    }
  }

  onChange = event => {
    console.log("Test", event);
    this.props.updateProperty(this.props.element, event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  renderElementProperties() {
    const properties = Object.keys(ElementLibrary[this.props.element.type].properties);
    return (
      <div>
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
  const { selectedElement, elements } = state.designerState;
  const selectedElementObj = elements.find(e => e.id === selectedElement);
  return { element: selectedElementObj };
};

const mapDispatch = dispatch => ({
  updateProperty: debounce((...args) => dispatch(designerOperations.updateElementProperty(...args)), 500),
  deleteElement: element => dispatch(designerOperations.deleteElement(element))
});

export default connect(mapState, mapDispatch)(Properties);
