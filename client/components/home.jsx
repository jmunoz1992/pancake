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
            <h3>A project management tool for fullstack development</h3>
          </div>
          <img className="carousel-image" src="/images/bg.jpg" />
        </div>
        <div id="all-cards">
          <div className="cards shadow container">
            <Link to={"/mockups"}>
              <h2 className="card-title">MOCKUPS</h2>
              <div className="card-img" id="kanban-img" />
              <div className="overlay">
                <div className="div-card-text">
                  <h2>MOCKUPS</h2>
                  <p>Mockup several frontend wireframes with different drag and drop components.</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="cards shadow container">
            <Link to={"/schema"}>
              <h2 className="card-title">SCHEMA DESIGNER</h2>
              <div className="card-img" id="schema-img" />
              <div className="overlay">
                <div className="div-card-text">
                  <h2>SCHEMA DESIGNER</h2>
                  <p>
                    Outline your backend models, links, and associations using drag and drop tables and
                    labels.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="cards shadow container">
            <Link to={"/board"}>
              <h2 className="card-title">Kanban Board</h2>
              <div className="card-img" id="kanban-img" />
              <div className="overlay">
                <div className="div-card-text">
                  <h2>Kanban Board</h2>
                  <p>
                    Organize all your project's issues by dragging and dropping each issue to their respective
                    columns.
                  </p>
                </div>
              </div>
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
