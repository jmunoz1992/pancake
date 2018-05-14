import React, { Component } from "react";
import { connect } from "react-redux";
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
    // TODO: Fix mockup issue filter
    this.props.doSetFilter();
  };

  // If the element isn't selected, we wrap it with a div and pass in style/CSS props received
  // from StyledComponents
  render() {
    const { element, offset } = this.props;
    const component = ElementLibrary[this.props.element.type].element.COMPONENT;
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
