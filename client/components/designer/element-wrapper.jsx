import { default as React } from "react";

export class ElementComponentWrapper extends React.Component {
  style = {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    background: "transparent"
  };

  shouldComponentUpdate(newProps) {
    return newProps.element !== this.props.element;
  }

  render() {
    const Component = this.props.component;
    return (
      <div style={this.style}>
        <Component element={this.props.element} />
      </div>
    );
  }
}
