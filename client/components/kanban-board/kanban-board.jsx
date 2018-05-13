import React, { Component } from "react";
import { connect } from "react-redux";
import Board from "react-trello";

class KanbanBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inboxIssues: [],
        };
    }

    createIssueCard = issue => {
        return {
            id: issue.id,
            title: issue.title,
            description: issue.body,
        };
    }

    createBoard = () => {
        const { inboxIssues, nextIssues, todoIssues, inProgressIssues, completedIssues } = this.props;
        return {
            lanes:
                [
                    {
                        id: "lane1",
                        title: "Inbox",
                        label: "0/0",
                        cards: inboxIssues ? inboxIssues.map(issue => this.createIssueCard(issue)) : [],
                    },
                    {
                        id: "lane2",
                        title: "To-Do",
                        label: "0/0",
                        cards: todoIssues ? todoIssues.map(issue => this.createIssueCard(issue)) : [],
                    },
                    {
                        id: "lane3",
                        title: "Next",
                        label: "0/0",
                        cards: nextIssues ? nextIssues.map(issue => this.createIssueCard(issue)) : [],
                    },
                    {
                        id: "lane4",
                        title: "In Progress",
                        label: "0/0",
                        cards: inProgressIssues ? inProgressIssues.map(issue => this.createIssueCard(issue)) : []
                    },
                    {
                        id: "lane5",
                        title: "Completed",
                        label: "0/0",
                        cards: completedIssues ? completedIssues.map(issue => this.createIssueCard(issue)) : []
                    },
                ]
        };
    }

    render() {
        return (
            <div>
                <Board data={this.createBoard()} />
            </div>
        );
    }
}

const mapState = ({ issues, collaborators, labels }) => {
    const issueList = issues.issueList;
    const todoIssues = issueList.filter(issue => issue.labels.find(label => label.name === "todo"));
    const nextIssues = issueList.filter(issue => issue.labels.find(label => label.name === "next"));
    const inProgressIssues = issueList.filter(issue => issue.labels.find(label => label.name === "in progress"));
    const completedIssues = issueList.filter(issue => issue.labels.find(label => label.name === "completed"));
    // issues missing a lane tag go in the inbox
    const inboxIssues = issueList.filter(issue => issue.labels.find(label => (label.name !== "todo") && (label.name !== "next") && (label.name !== "in progress") && (label.name !== "completed")));
    console.log("inboxIssues", inboxIssues);
    return { collaborators, labels, todoIssues, nextIssues, inProgressIssues, completedIssues };
};

export default connect(mapState, null)(KanbanBoard);
