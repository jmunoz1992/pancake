import React from "react";
import { DesignerToolbox, DesignerProperties } from "./index";
import { connect } from "react-redux";
import { Issues } from "../";
import { Tab } from "semantic-ui-react";
import { default as styled } from "styled-components";

const SchemaSidebar = props => {
  const panes = [
    {
      menuItem: "Issues",
      render: () => (
        <Tab.Pane attached={false}>
          <Issues />
        </Tab.Pane>
      )
    }
  ];

  return (
    <Wrapper>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default SchemaSidebar;
