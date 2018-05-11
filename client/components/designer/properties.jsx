import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button } from "semantic-ui-react";
import { designerOperations } from "../../store";
import { default as ElementLibrary } from "./elements";

class Properties extends Component {
  constructor(props) {
    super(props);
    this.state = { form: {} };
  }

  BASE_PROPERTIES = {
    name: { name: "Element Name", label: "Element Name", type: "string", value: "" },
    zIndex: { name: "Z-Index", label: "Z-Index", type: "number", value: "" }
  };

  componentWillReceiveProps(props) {
    if (!props.elements[0]) {
      return this.setState({ form: {} });
    }

    // Collect the properties we need to render form fields for.
    // If one element is selected, we want to show form fields for all of its properties.
    // If multiple elements are selected, we want to show form fields for only the base properties.

    const state = { ...this.BASE_PROPERTIES };
    if (props.elements.length === 1) {
      const propertyList = { ...ElementLibrary[props.elements[0].type].properties, ...this.BASE_PROPERTIES };
      for (const key in propertyList) {
        if (propertyList.hasOwnProperty(key)) {
          const property = propertyList[key];
          state[key] = {
            label: property.name,
            type: property.type,
            value: props.elements[0][key]
          };
        }
      }
    }

    this.setState({ form: state });
  }

  onChange = event => {
    const formState = { ...this.state.form };
    if (this.props.elements.length > 1) {
      // Multiple elements selected, update all of them
      this.props.bulkUpdateProperty(this.props.elements, event.target.name, event.target.value);
    } else {
      // Update a single element
      this.props.updateProperty(this.props.elements[0], event.target.name, event.target.value);
    }
    formState[event.target.name].value = event.target.value;
    this.setState({ form: formState });
  };

  render() {
    return (
      <div style={{ height: "50%", overflowY: "scroll", paddingRight: "10px" }}>
        <h2>Properties</h2>
        {this.props.elements.length > 1 ? (
          <p>
            {this.props.elements.length} elements selected. Changes made below will be applied to all of them.
          </p>
        ) : null}
        {Object.keys(this.state.form).length ? this.renderForm() : <p>Nothing selected.</p>}
      </div>
    );
  }

  renderForm() {
    const fields = [];
    for (const key in this.state.form) {
      if (this.state.form.hasOwnProperty(key)) {
        const field = this.state.form[key];
        fields.push(
          <Form.Input
            key={key}
            label={`${field.label}:`}
            name={key}
            onChange={this.onChange}
            value={field.value}
          />
        );
      }
    }
    return <Form>{fields}</Form>;
  }

  renderField() {}

  renderElementProperties() {
    if (this.props.elements.length > 1) return <p>{this.props.elements.length} elements selected.</p>;

    const properties = this.getProperties();

    return (
      <div>
        {/* <p>{`ID: ${this.props.elements[0].id}`}</p>
        <p>{`Position: ${this.props.elements[0].left}, ${this.props.elements[0].top}`}</p>
        <p>{`Height: ${this.props.elements[0].height}x${this.props.elements[0].width}`}</p> */}
        <Form>
          {properties.map(property => (
            <Form.Input
              key={property.name}
              label={`${property.name}:`}
              name={property.name}
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
  const selectedIdSet = new Set(selectedElements);
  return { elements: elements.filter(element => selectedIdSet.has(element.id)) };
};

const mapDispatch = dispatch => ({
  bulkUpdateProperty: debounce((elementList, propertyKey, propertyValue) => {
    // Loop through all selected elements and dispatch an updateElementProperty action for each
    elementList.forEach(element => {
      dispatch(designerOperations.updateElementProperty(element, propertyKey, propertyValue));
    });
  }, 500),
  updateProperty: debounce((...args) => dispatch(designerOperations.updateElementProperty(...args)), 500),
  deleteElement: () => dispatch(designerOperations.deleteElement())
});

export default connect(mapState, mapDispatch)(Properties);
