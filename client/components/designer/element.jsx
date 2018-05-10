import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { SelectedElement } from "./";
import { default as ElementLibrary } from "./elements";
import { designerOperations, setIssueFilter } from "../../store";

class MockupElement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onElementClicked = _ => {
    if (!this.props.selected) {
      !this.props.selected && this.props.doSelectElement();
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
        element={this.props.element}>
        {this.renderElement()}
      </SelectedElement>
    );
  }

  // If the element isn't selected, we wrap it with a div and pass in style/CSS props received
  // from StyledComponents
  renderUnselected() {
    return (
      <div className={this.props.className} style={this.props.style} onClick={this.onElementClicked}>
        {this.renderElement()}
      </div>
    );
  }

  // We need to associate an Element with an actual React Component, which we can do by using its
  // type property to look it up in the ElementLibrary.  ElementLibrary contains information about
  // all of the different element types, and also has a reference to the appropriate React
  // Component to render.
  renderElement() {
    const ElementToRender = ElementLibrary[this.props.element.type].element.COMPONENT;
    const ClickInterceptor = styled.div`
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: transparent;
    `;
    return (
      // ClickInterceptor is an invisible overlay that stops mouse events, so the user doesn't
      // accidentally click on textboxes or buttons while trying to drag a mockup element around.
      <ClickInterceptor>
        <ElementToRender element={this.props.element} />
      </ClickInterceptor>
    );
  }
}

// StyledComponents warns against putting frequently modified styles (like position while the user
// is dragging an element around) inside of the template string and instead suggests using `attrs`.
const StyledWireframeElement = styled(MockupElement).attrs({
  style: ({ element, offset }) => ({
    transform: `translate(${element.left + offset.x}px, ${element.top + offset.y}px)`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    zIndex: `${element.zIndex}`
  })
})`
  position: absolute;
  outline: ${({ selected }) => (selected ? "1px solid black" : "none")};
  background-color: ${({ selected }) => (selected ? "#EAEAEA" : "transparent")};
  overflow: hidden;
`;

const mapDispatch = (dispatch, ownProps) => ({
  doSelectElement: () => dispatch(designerOperations.selectElement(ownProps.element)),
  doSetFilter: () => dispatch(setIssueFilter(ownProps.element.name))
});

export default connect(null, mapDispatch)(StyledWireframeElement);
