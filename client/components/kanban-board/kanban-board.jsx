import React, { Component } from "react";
import { connect } from "react-redux";
import Board from "react-trello";

class KanbanBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getData = () => {
        return {
            lanes:
                [
                    {
                        id: "lane1",
                        title: "Inbox",
                        label: "0/0",
                        cards: []
                    },
                    {
                        id: "lane2",
                        title: "To-Do",
                        label: "0/0",
                        cards: []
                    },
                    {
                        id: "lane3",
                        title: "Next",
                        label: "0/0",
                        cards: []
                    },
                    {
                        id: "lane4",
                        title: "In Progress",
                        label: "0/0",
                        cards: []
                    },
                    {
                        id: "lane5",
                        title: "Completed",
                        label: "0/0",
                        cards: []
                    },
                ]
        };
    }

    render() {
        return (
            <div>
                <Board data={this.getData()} />
            </div>
        );
    }
}

const mapState = ({ issues, collaborators, labels }) => ({ issues, collaborators, labels });

export default connect(mapState, null)(KanbanBoard);
