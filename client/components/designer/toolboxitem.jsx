import React from "react";
import styled from "styled-components";
import { Segment, Label } from "semantic-ui-react";

const ToolboxItem = ({ handleClick, item }) => {
  const ComponentToRender = item.element.COMPONENT;
  const Wrapper = styled.div``;

  return (
    <Segment raised secondary onClick={handleClick}>
      <div style={{ marginBottom: "25px", pointerEvents: "none" }}>
        <ComponentToRender element={item.properties} />
      </div>
      <Label attached="bottom">{item.title}</Label>
    </Segment>
  );
};

export default ToolboxItem;
