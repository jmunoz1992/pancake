import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, List, Header, Button, Icon } from "semantic-ui-react";
import { EditIssue } from "../issues";
import { editIssue } from "../../store/issues";

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

  assignIssueToPullRequest = event => {
    const issueToAssignNumber = +event.target.value;
    this.findIssueToAssign(issueToAssignNumber);
    this.removeAssignedIssueFromList(issueToAssignNumber);
  };

  findIssueToAssign = issueNumber => {
    const issueToAssign = this.props.issues.filter(issue => issue.number === +issueNumber)[0];
    this.setState({ relatedIssues: [...this.state.relatedIssues, issueToAssign] });
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

  removeFromAssigned = event => {
    const issueToAssignNumber = +event.target.value;
    this.findIssueToAssignBack(issueToAssignNumber);
    this.removeAssignedIssueFromRelatedList(issueToAssignNumber);
  };

  findIssueToAssignBack = issueNumber => {
    const issueToAssignBack = this.state.relatedIssues.filter(issue => issue.number === issueNumber)[0];
    this.setState({ possibleIssuesToAssign: [...this.state.possibleIssuesToAssign, issueToAssignBack] });
  };

  removeAssignedIssueFromRelatedList = issueNumber => {
    const newRelatedIssues = this.state.relatedIssues.filter(issue => issue.number !== issueNumber);
    this.setState({ relatedIssues: newRelatedIssues });
  };

  render() {
    const { pullRequest } = this.props;
    console.log("current related issues ", this.state.relatedIssues);
    console.log("list of possible issues ", this.state.possibleIssuesToAssign);
    return (
      <Modal.Content style={{ textAlign: "center" }}>
        <h1>
          Pull Request #{pullRequest.number}: {pullRequest.title}
        </h1>
        <br />
        {this.state.relatedIssues.length > 0 ? (
          <div>
            <Header style={{ marginLeft: "20px" }}>Assigned Issues To This PR. Remove Unrelated.</Header>
            {this.state.relatedIssues.map(issue => {
              return (
                <div key={issue.id}>
                  <EditIssue issue={issue} />
                  <Button
                    icon
                    onClick={event => this.removeFromAssigned(event)}
                    color="red"
                    value={issue.number}>
                    Remove
                  </Button>
                  <br /> <br />
                </div>
              );
            })}
          </div>
        ) : null}
        <br />
        <Header style={{ marginLeft: "20px" }}>Possible Issues Related To This PR. Assign Related.</Header>
        {this.state.possibleIssuesToAssign.map(issue => {
          return (
            <div key={issue.id}>
              <EditIssue issue={issue} />
              <Button
                icon
                onClick={event => this.assignIssueToPullRequest(event)}
                color="green"
                value={issue.number}>
                Assign
              </Button>
              <br /> <br />
            </div>
          );
        })}
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
  console.log("issues in edit pull request ", issues);
  return { issues: issues.issueList, filter: issues.filter };
};

const mapDispatch = dispatch => {
  return {
    editPickedIssue(issue) {
      dispatch(editIssue(issue));
    }
  };
};

export default connect(mapState, mapDispatch)(EditPullRequest);
