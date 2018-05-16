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
            <h3>Collaborative, full-stack planning and project management</h3>
          </div>
          <img className="carousel-image" src="/images/bg.jpg" />
        </div>
        <div id="all-cards">
          <div className="cards shadow container">
            <Link to={"/mockups"}>
              <h2 className="card-title">Mockup Designer</h2>
              <div className="card-img" id="kanban-img" />
              <div className="overlay">
                <div className="div-card-text">
                  <h2>Mockup Designer</h2>
                  <p>Plan your front-end by dragging and dropping UI components to build wireframe mockups</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="cards shadow container">
            <Link to={"/schema"}>
              <h2 className="card-title">Schema Designer</h2>
              <div className="card-img" id="schema-img" />
              <div className="overlay">
                <div className="div-card-text">
                  <h2>Schema Designer</h2>
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
              <h2 className="card-title">Scrum Board</h2>
              <div className="card-img" id="kanban-img" />
              <div className="overlay">
                <div className="div-card-text">
                  <h2>Scrum Board</h2>
                  <p>
                    Organize your project's issues and user stories by dragging and dropping each issue to
                    their respective columns.
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
