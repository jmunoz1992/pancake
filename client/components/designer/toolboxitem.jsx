import React from "react";
import { Segment, Label } from "semantic-ui-react";

const ToolboxItem = ({ handleClick, item }) => {
  const ComponentToRender = item.element.COMPONENT;
  const elementProps = {};
  for (const key in item.properties) {
    if (item.properties.hasOwnProperty(key)) {
      const property = item.properties[key];
      elementProps[key] = property.default || property.name;
    }
  }
  return (
    <Segment raised secondary onClick={handleClick}>
      <div style={{ marginBottom: "25px", pointerEvents: "none" }}>
        <ComponentToRender element={elementProps} />
      </div>
      <Label attached="bottom">{item.title}</Label>
    </Segment>
  );
};

export default ToolboxItem;
