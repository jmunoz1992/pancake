import React, { Component } from "react";
import { connect } from "react-redux";
import Board from "react-trello";

import { addLabel, removeLabel } from "../../store/issues";

class KanbanBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inboxIssues: [],
        };
    }

    createIssueCard = issue => {
        return {
            id: String(issue.id),
            title: issue.title,
            description: issue.body,
        };
    }

    getIssueFromId = id => this.props.issueList.find(issue => String(issue.id) === String(id));

    getLabelFromName = name => this.props.labels.find(label => label.name === name)

    handleDragEnd = (cardId, sourceLaneId, targetLaneId) => {
        const issue = this.getIssueFromId(cardId);
        this.props.removeLabel(issue, [sourceLaneId]);
        this.props.addLabel(issue, [targetLaneId]);
    };

    createBoard = () => {
        const { inboxIssues, nextIssues, todoIssues, inProgressIssues, completedIssues } = this.props;
        return {
            lanes:
                [
                    {
                        id: "inbox",
                        title: "Inbox",
                        label: "",
                        cards: inboxIssues ? inboxIssues.map(issue => this.createIssueCard(issue)) : [],
                    },
                    {
                        id: "todo",
                        title: "To-Do",
                        label: "",
                        cards: todoIssues ? todoIssues.map(issue => this.createIssueCard(issue)) : [],
                    },
                    {
                        id: "next",
                        title: "Next",
                        label: "",
                        cards: nextIssues ? nextIssues.map(issue => this.createIssueCard(issue)) : [],
                    },
                    {
                        id: "in progress",
                        title: "In Progress",
                        label: "",
                        cards: inProgressIssues ? inProgressIssues.map(issue => this.createIssueCard(issue)) : []
                    },
                    {
                        id: "completed",
                        title: "Completed",
                        label: "",
                        cards: completedIssues ? completedIssues.map(issue => this.createIssueCard(issue)) : []
                    },
                ]
        };
    }

    render() {
        return (
            <div>
                <Board
                    data={this.createBoard()}
                    draggable
                    handleDragEnd={this.handleDragEnd}
                />
            </div>
        );
    }
}

const hasLaneLabel = issue => {
    const { labels } = issue;
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].name === "todo") return true;
        if (labels[i].name === "next") return true;
        if (labels[i].name === "in progress") return true;
        if (labels[i].name === "completed") return true;
    }
    return false;
};

const mapState = ({ issues, collaborators, labels }) => {

    const issueList = issues.issueList;
    const todoIssues = issueList.filter(issue => issue.labels.find(label => label.name === "todo"));
    const nextIssues = issueList.filter(issue => issue.labels.find(label => label.name === "next"));
    const inProgressIssues = issueList.filter(issue => issue.labels.find(label => label.name === "in progress"));
    const completedIssues = issueList.filter(issue => issue.labels.find(label => label.name === "completed"));
    // issues missing a lane tag go in the inbox
    const inboxIssues = issueList.filter(issue => hasLaneLabel(issue));
    return { collaborators, labels, inboxIssues, todoIssues, nextIssues, inProgressIssues, completedIssues, issueList };
};

const mapDispatch = { addLabel, removeLabel };

export default connect(mapState, mapDispatch)(KanbanBoard);
