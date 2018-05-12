import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchPullRequests } from "../store";
import { List, Modal, Button } from "semantic-ui-react";
import { PullRequests } from "./pull-requests";

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadPullRequests();
  }
  render() {
    let { pullRequests } = this.props;
    return (
      <div>
        <PullRequests allPullRequests={pullRequests} />
      </div>
    );
  }
}

const mapState = ({ pullRequests }) => {
  return { pullRequests };
};

const mapDispatch = dispatch => {
  return {
    loadPullRequests() {
      dispatch(fetchPullRequests());
    }
  };
};

export default withRouter(connect(mapState, mapDispatch)(Board));
