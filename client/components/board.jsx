import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchPullRequests } from "../store";
import { List } from "semantic-ui-react";
import { PullRequestItem } from "./pull-requests";

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
        <h1>All Open Pull Requests</h1>
        <List>
          {pullRequests.map(pullRequest => (
            <PullRequestItem key={pullRequest.id} pullRequest={pullRequest} />
          ))}
        </List>
      </div>
    );
  }
}

const mapState = ({ pullRequests }) => {
  console.log("pull requests in mapState on board", pullRequests);
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
