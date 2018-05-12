import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, List, Header, Button, Icon } from "semantic-ui-react";
import { EditIssue } from "../issues";
import { editIssue, editPullRequest } from "../../store";

class EditPullRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      possibleIssuesToAssign: this.props.issues,
      issueToDelete: {},
      relatedIssues: []
    };
  }

  componentDidMount() {
    this.filterIssues();
  }

  closePickedIssue = event => {
    let issueToAssignNumber = 0;
    if (event.target) {
      issueToAssignNumber = +event.target.value;
    } else {
      issueToAssignNumber = event;
    }
    const issue = this.findIssueToAssign(issueToAssignNumber);
    issue.state = "closed";
    this.props.editPickedIssue(issue);
    this.removeAssignedIssueFromList(issueToAssignNumber);
  };

  findIssueToAssign = issueNumber => {
    const issueToAssign = this.props.issues.filter(issue => issue.number === +issueNumber)[0];
    return issueToAssign;
  };

  removeAssignedIssueFromList = issueNumber => {
    const otherPossibleIssues = this.state.possibleIssuesToAssign.filter(issue => {
      if (issue.number !== issueNumber) {
        return issue;
      }
    });
    this.setState({ possibleIssuesToAssign: otherPossibleIssues });
  };

  closeAllIssuesInList = () => {
    this.state.possibleIssuesToAssign.map(issue => {
      return this.closePickedIssue(issue.number);
    });
    this.setState({ possibleIssuesToAssign: [] });
  };

  render() {
    const { pullRequest } = this.props;
    return (
      <Modal.Content style={{ textAlign: "center" }}>
        <h1>
          Pull Request #{pullRequest.number}: {pullRequest.title}
        </h1>
        <br />
        {this.state.possibleIssuesToAssign.length > 0 ? (
          <div>
            <Header style={{ marginLeft: "20px" }}>Possible Issues Related To This PR. Close Related.</Header>
            {this.state.possibleIssuesToAssign.map(issue => {
              return (
                <div key={issue.id}>
                  <EditIssue issue={issue} />
                  <Button
                    icon
                    onClick={event => this.closePickedIssue(event)}
                    color="red"
                    value={issue.number}>
                    Close Issue
                  </Button>
                  <br /> <br />
                </div>
              );
            })}
            <br /> <br />
            <Button icon onClick={this.closeAllIssuesInList} color="red">
              Close All Issues In This List
            </Button>
          </div>
        ) : (
          <h3>There are no issues related to this pull request</h3>
        )}
      </Modal.Content>
    );
  }

  filterIssues = () => {
    const pullRequestTitle = this.props.pullRequest.title;
    const issues = this.state.possibleIssuesToAssign;
    const relatedIssues = issues.filter(issue => {
      if (issue.title !== pullRequestTitle) {
        const prTitleArr = pullRequestTitle.split(" ");
        const issueTitleArr = issue.title.split(" ");
        if (this.issuesRelatedToTitle(issueTitleArr, prTitleArr)) {
          return issue;
        }
      }
    });
    this.setState({ possibleIssuesToAssign: relatedIssues });
  };

  issuesRelatedToTitle = (issuesArr, titleArr) => {
    if (!issuesArr || !titleArr || issuesArr.length === 0 || titleArr.length === 0) {
      return false;
    }
    const filteredIssues = issuesArr.filter(issueWord => titleArr.includes(issueWord));
    return filteredIssues.length > 0;
  };
}

const mapState = ({ issues }) => {
  return { issues: issues.issueList, filter: issues.filter };
};

const mapDispatch = dispatch => {
  return {
    editPickedIssue(issue) {
      dispatch(editIssue(issue));
    },
    editThisPullRequestBody(pullRequest) {
      dispatch(editPullRequest(pullRequest));
    }
  };
};

export default connect(mapState, mapDispatch)(EditPullRequest);
