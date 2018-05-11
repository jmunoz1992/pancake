import React, { Component } from "react";
import { connect } from "react-redux";
import { SelectedElement } from "./";
import { default as ElementLibrary } from "./elements";
import { designerOperations, setIssueFilter } from "../../store";
import { ElementComponentWrapper } from "./element-wrapper";

class MockupElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onElementClicked = _ => {
    if (!this.props.selected) {
      this.props.shiftDown ? this.props.doAddElementToSelection() : this.props.doSelectElement();
    }
    if (!this.props.editMode) this.props.doSetFilter();
  };

  render() {
    return this.props.selected && this.props.editMode ? this.renderSelected() : this.renderUnselected();
  }

  renderSelected() {
    return (
      <SelectedElement
        className={this.props.className}
        offset={this.props.offset}
        element={this.props.element}
        style={{
          position: "absolute",
          outline: "1px solid black",
          backgroundColor: "#EAEAEA",
          overflow: "hidden"
        }}>
        {this.renderElement()}
      </SelectedElement>
    );
  }

  // If the element isn't selected, we wrap it with a div and pass in style/CSS props received
  // from StyledComponents
  renderUnselected() {
    const { element, offset } = this.props;
    return (
      <div
        className={this.props.className}
        style={{
          transform: `translate(${element.left + offset.x}px, ${element.top + offset.y}px)`,
          width: `${element.width}px`,
          height: `${element.height}px`,
          zIndex: `${element.zIndex}`,
          position: "absolute",
          outline: "none",
          backgroundColor: "transparent",
          overflow: "hidden"
          //   outline: ${({ selected }) => (selected ? "1px solid black" : "none")};
          //   background-color: ${({ selected }) => (selected ? "#EAEAEA" : "transparent")};
          //   overflow: hidden;
        }}
        onClick={this.onElementClicked}>
        {this.renderElement()}
      </div>
    );
  }

  // We need to associate an Element with an actual React Component, which we can do by using its
  // type property to look it up in the ElementLibrary.  ElementLibrary contains information about
  // all of the different element types, and also has a reference to the appropriate React
  // Component to render.
  renderElement() {
    const component = ElementLibrary[this.props.element.type].element.COMPONENT;
    const style = {
      position: "absolute",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      background: "transparent"
    };
    return (
      // ClickInterceptor is an invisible overlay that stops mouse events, so the user doesn't
      // accidentally click on textboxes or buttons while trying to drag a mockup element around.
      <div style={style}>
        <ElementComponentWrapper component={component} element={this.props.element} />
      </div>
    );
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  doSelectElement: () => dispatch(designerOperations.selectElements([ownProps.element.id])),
  doAddElementToSelection: () => dispatch(designerOperations.addElementsToSelection([ownProps.element.id])),
  doSetFilter: () => dispatch(setIssueFilter(ownProps.element.name))
});

export default connect(null, mapDispatch)(MockupElement);
