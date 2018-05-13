import React, { Component } from "react";
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
        const data = {
            lanes: [
                {
                    id: "lane1",
                    title: "Planned Tasks",
                    label: "2/2",
                    cards: [
                        { id: "Card1", title: "Write Blog", description: "Can AI make memes", label: "30 mins" },
                        { id: "Card2", title: "Pay Rent", description: "Transfer via NEFT", label: "5 mins", metadata: { sha: "be312a1" } }
                    ]
                },
                {
                    id: "lane2",
                    title: "Completed",
                    label: "0/0",
                    cards: []
                }
            ]
        };
        return (
            <div>
                <Board data={this.getData()} />
            </div>
        );
    }
}

export default KanbanBoard;
