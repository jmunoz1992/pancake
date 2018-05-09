import React from "react";
import { Loader, Header, Icon, Dimmer } from "semantic-ui-react";
import { connect } from "react-redux";
import styled from "styled-components";

const SocketModal = props => {
  const status = props.networkStatus;
  if (status.connected) return null;
  const StyledDimmer = styled(Dimmer)`
    &&& {
      z-index: 100;
    }
  `;
  let renderFragment;
  if (status.connecting) {
    if (status.error) {
      renderFragment = (
        <Loader>
          <Header as="h2" icon inverted>
            Connection Lost
            <Header.Subheader>Pancake is trying to reconnect...</Header.Subheader>
          </Header>
        </Loader>
      );
    } else {
      renderFragment = <Loader>Connecting...</Loader>;
    }
  } else {
    renderFragment = (
      <Header as="h2" icon inverted>
        <Icon name="warning sign" />
        Unable to Connect
        <Header.Subheader>{String(status.error)}</Header.Subheader>
      </Header>
    );
  }
  return <StyledDimmer active>{renderFragment}</StyledDimmer>;
};

const mapState = state => {
  return {
    networkStatus: state.designer.networkStatus
  };
};

export default connect(mapState, null)(SocketModal);
