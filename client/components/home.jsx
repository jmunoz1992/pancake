import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card } from "antd";
const { Meta } = Card;

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div id="carousel">
          <div id="carousel-text">
            <h1>Welcome To Pancake</h1>
            <h3>A project management tool for web development.</h3>
          </div>
          <img className="carousel-image" src="/bg.jpg" />
        </div>
        <div id="all-cards">
          <div className="cards">
            <Link to={"/mockups"}>
              <h2 id="schema-title">MOCKUP WIREFRAMES</h2>
              <img id="schema" src="/kanban.png" height="105px" width="244px" />
              <p style={{ color: "white", textAlign: "center", padding: "10px" }}>
                Mockup several frontend wireframes.
              </p>
            </Link>
          </div>
          <div className="cards" id="schema-card">
            <Link to={"/schema"}>
              <h2 id="schema-title">SCHEMA DESIGNER</h2>
              <img id="schema" src="/schema.png" height="105px" width="244px" />
              <p style={{ color: "white", textAlign: "center", padding: "10px" }}>
                Outline your backend models, links, and associations.
              </p>
            </Link>
          </div>
          <div className="cards">
            <Link to={"/board"}>
              <h2 id="schema-title">KANBAN BOARD</h2>
              <img id="schema" src="/kanban.png" height="105px" width="244px" />
              <p style={{ color: "white", textAlign: "center", padding: "10px" }}>
                Organize all your project's issues with an agile kanban board.
              </p>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ user }) => ({ user });

const mapDispatch = dispatch => {
  return {};
};

export default withRouter(connect(mapState, mapDispatch)(Home));
