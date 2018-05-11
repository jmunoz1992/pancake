import React from "react";
import { DesignerToolbox, DesignerProperties } from "./index";
import { connect } from "react-redux";
import { Issues } from "../";

const DesignerSidebar = props => {
  return props.areElementsSelected ? (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flexBasis: "50%", overflowY: "scroll", paddingRight: "10px" }}>
        <Issues />
      </div>
      <div style={{ flexBasis: "50%", overflowY: "scroll", paddingRight: "10px" }}>
        <DesignerProperties />
      </div>
    </div>
  ) : (
    <DesignerToolbox />
  );
};

const mapState = state => ({ areElementsSelected: state.designer.selectedElements.length });

export default connect(mapState, null)(DesignerSidebar);
