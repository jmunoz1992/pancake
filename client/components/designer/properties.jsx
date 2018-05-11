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
        {this.props.elements.length && this.props.elements[0] ? (
          this.renderElementProperties()
        ) : (
          <p>Nothing selected.</p>
        )}
      </div>
    );
  }

  componentWillReceiveProps(props) {
    if (props.elements.length === 1 && props.elements[0]) {
      const properties = this.getProperties.call({ props });
      properties.forEach(property => {
        this.setState({ [property]: props.elements[0][property] });
      });
    }
  }

  onChange = event => {
    this.props.updateProperty(this.props.elements[0], event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  getProperties() {
    const properties = Object.keys(ElementLibrary[this.props.elements[0].type].properties);
    properties.push("name", "zIndex");
    return properties;
  }

  renderElementProperties() {
    if (this.props.elements.length > 1) return <p>{this.props.elements.length} elements selected.</p>;

    const properties = this.getProperties();

    return (
      <div>
        <p>{`ID: ${this.props.elements[0].id}`}</p>
        <p>{`Position: ${this.props.elements[0].left}, ${this.props.elements[0].top}`}</p>
        <p>{`Height: ${this.props.elements[0].height}x${this.props.elements[0].width}`}</p>
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
        <Button negative onClick={() => this.props.deleteElement()}>
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
  const { selectedElements, elements } = state.designer;
  const selectedElementObjects = selectedElements.map(id => elements.find(element => element.id === id));

  return { elements: selectedElementObjects };
};

const mapDispatch = dispatch => ({
  updateProperty: debounce((...args) => dispatch(designerOperations.updateElementProperty(...args)), 500),
  deleteElement: () => dispatch(designerOperations.deleteElement())
});

export default connect(mapState, mapDispatch)(Properties);
