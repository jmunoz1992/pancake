import React from "react";
import { SchemaProperties } from "./index";
import { Tab } from "semantic-ui-react";
import { Issues } from "../index";

const panes = [
  {
    menuItem: "Properties",
    render: () => (
      <Tab.Pane>
        <SchemaProperties />
      </Tab.Pane>
    )
  },
  {
    menuItem: "Issues Schema",
    render: () => (
      <Tab.Pane>
        <Issues />
      </Tab.Pane>
    )
  }
];

const SchemaSidebar = props => {
  return (
    <div style={{ height: "100%" }}>
      <Tab panes={panes} />
    </div>
  );
};

export default SchemaSidebar;
