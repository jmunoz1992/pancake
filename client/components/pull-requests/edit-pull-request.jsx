import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal, List, Header, Button, Icon } from "semantic-ui-react";
import { EditIssue } from "../issues";
import { editIssue } from "../../store/issues";

class EditPullRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issues: this.props.issues,
      issueToDelete: {}
    };
  }

  componentDidMount() {
    this.filterIssues();
  }

  closeIssue = event => {
    console.log("closing this issue!", event.target.value);
    console.log("props reached here ? ", this.props.editPickedIssue);
    const issueToDelete = this.findIssueToDelete(event.target.value);
    issueToDelete.state = "closed";
    this.props.editPickedIssue(issueToDelete);
  };

  findIssueToDelete(issueNumber) {
    return this.props.issues.filter(issue => issue.number === +issueNumber)[0];
  }

  render() {
    console.log("props in here ", this.props);
    const { pullRequest } = this.props;
    return (
      <Modal.Content style={{ textAlign: "center" }}>
        <h1>
          Pull Request #{pullRequest.number}: {pullRequest.title}
        </h1>
        <br />
        <Header style={{ marginLeft: "20px" }}>Possible Related Issues</Header>
        {this.state.issues.map(issue => {
          return (
            <div key={issue.id}>
              <EditIssue issue={issue} />
              <Button icon onClick={event => this.closeIssue(event)} color="red" value={issue.number}>
                Close Issue
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
    const issues = this.state.issues;
    const relatedIssues = issues.filter(issue => {
      if (issue.title !== pullRequestTitle) {
        const prTitleArr = pullRequestTitle.split(" ");
        const issueTitleArr = issue.title.split(" ");
        if (this.issuesRelatedToTitle(issueTitleArr, prTitleArr)) {
          return issue;
        }
      }
    });
    this.setState({ issues: relatedIssues });
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
