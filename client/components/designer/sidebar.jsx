import React from "react";
import Toolbox from "./toolbox";
import { DesignerToolbox, DesignerProperties } from "./index";

const DesignerSidebar = props => {
  return (
    <div style={{ height: "100%" }}>
      <DesignerToolbox />
      <DesignerProperties />
    </div>
  );
};

export default DesignerSidebar;
