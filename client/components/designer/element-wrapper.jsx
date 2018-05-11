import { default as React } from "react";

export class ElementComponentWrapper extends React.Component {
  shouldComponentUpdate(newProps) {
    return newProps.element !== this.props.element;
  }

  render() {
    const Component = this.props.component;
    return <Component element={this.props.element} />;
  }
}
