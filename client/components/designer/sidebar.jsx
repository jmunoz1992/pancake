import React from "react";
import { DesignerToolbox, DesignerProperties } from "./index";
import { connect } from "react-redux";
import { Issues } from "../";

const DesignerSidebar = props => {
  if (props.editMode) {
    return (
      <div style={{ height: "100%" }}>
        <DesignerToolbox />
        <DesignerProperties />
      </div>
    );
  } else {
    return <Issues />;
  }
};

const mapState = state => ({ editMode: state.designer.config.editMode });

export default connect(mapState, null)(DesignerSidebar);
