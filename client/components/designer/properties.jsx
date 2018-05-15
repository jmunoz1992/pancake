import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button, Dropdown } from "semantic-ui-react";
import { designerOperations } from "../../store";
import { default as ElementLibrary } from "./elements";
import { default as AddLabelPopup } from "../issues/add-label-tooltip";

class Properties extends Component {
  constructor(props) {
    super(props);
    this.state = { form: {}, labels: [] };
  }

  BASE_PROPERTIES = {
    labels: { name: "Labels", label: "Labels", type: "labels", value: "" },
    zIndex: { name: "Z-Index", label: "Z-Index", type: "number", value: "" },
    keywords: { name: "Keywords", label: "Keywords", type: "string", value: "" }
  };

  componentDidMount() {
    this.setupForm(this.props);
  }

  componentWillReceiveProps(props) {
    this.setupForm(props);
  }

  setupForm(props) {
    if (!props.elements[0]) {
      return this.setState({ form: {} });
    }

    // Collect the properties we need to render form fields for.
    // If one element is selected, we want to show form fields for all of its properties.
    // If multiple elements are selected, we want to show form fields for only the base properties.

    const state = { ...this.BASE_PROPERTIES };
    if (props.elements.length === 1) {
      this.deserializeLabels(props.elements[0].labels);
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

  deserializeLabels(serialized) {
    if (serialized) this.setState({ labels: JSON.parse(serialized) });
  }

  serializeAndUpdateLabels = (event, target) => {
    this.setState({ labels: target.value });
    const serialized = JSON.stringify(target.value);
    if (this.props.elements.length > 1) {
      this.props.bulkUpdateProperty(this.props.elements, "labels", serialized);
    } else {
      this.props.updateProperty(this.props.elements[0], "labels", serialized);
    }
  };

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
      <div>
        <h2>Properties</h2>
        {this.props.elements.length > 1 ? (
          <p>{this.props.elements.length} elements selected. Changes will be applied to all of them.</p>
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
        if (field.type === "labels") fields.push(this.renderLabels(key, field));
        else fields.push(this.renderField(key, field));
      }
    }
    return (
      <div>
        <Form onSubmit={e => e.preventDefault()}>
          {fields}
          <Form.Field>
            <Button
              negative
              onClick={e => {
                e.preventDefault();
                if (e.detail === 0) return;
                this.props.deleteElement();
              }}>
              Delete
            </Button>
          </Form.Field>
        </Form>
      </div>
    );
  }

  renderLabels(key, fieldInfo) {
    const options = this.props.labels.map(label => ({ key: label.id, text: label.name, value: label.name }));
    return (
      <div key={key}>
        <Form.Group>
          <Form.Dropdown
            label="Labels:"
            placeholder="Labels"
            fluid
            multiple
            selection
            options={options}
            onChange={this.serializeAndUpdateLabels}
            value={this.state.labels}
            width={13}
          />
          <Form.Field style={{ paddingTop: "23px" }} width={1}>
            <AddLabelPopup />
          </Form.Field>
        </Form.Group>
      </div>
    );
  }

  renderField(key, fieldInfo) {
    return (
      <Form.Input
        key={key}
        label={`${fieldInfo.label}:`}
        name={key}
        onChange={this.onChange}
        value={fieldInfo.value}
      />
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
  return { labels: state.labels, elements: elements.filter(element => selectedIdSet.has(element.id)) };
};

const mapDispatch = dispatch => ({
  bulkUpdateProperty: debounce((elementList, propertyKey, propertyValue) => {
    // Loop through all selected elements and dispatch an updateElementProperty action for each
    elementList.forEach(element => {
      dispatch(designerOperations.updateElementProperty(element, propertyKey, propertyValue));
    });
  }, 500),
  updateProperty: debounce((...args) => dispatch(designerOperations.updateElementProperty(...args)), 500),
  deleteElement: () => dispatch(designerOperations.deleteElements())
});

export default connect(mapState, mapDispatch)(Properties);
