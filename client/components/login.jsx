import React from "react";
import { Message } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

/**
 * COMPONENT
 */
const Login = props => {
  return (
    <div style={{ margin: "auto", marginTop: "150px", width: "50%", textAlign: "center" }}>
      <img src="/images/Pancake.png" width="auto" height="200px" />
      <br />
      <br />
      <div style={{ margin: "auto", width: "50%", textAlign: "center", display: "inline" }}>
        <button className="ui github button" style={{ backgroundColor: "#0E8DEC" }}>
          <i className="github icon" />
          <a style={{ color: "#ffffff" }} href="/auth/github">
            Login As Regular User
          </a>
        </button>
        <button className="ui github button" style={{ backgroundColor: "#00cc00" }}>
          <i className="github icon" />
          <a style={{ color: "#ffffff" }} href="/auth/github/demo">
            Login As Demo User
          </a>
        </button>
      </div>
      {props.location.search && (
        <Message warning icon="padlock">
          {props.location.search.slice(props.location.search.indexOf("=") + 1)}
        </Message>
      )}
    </div>
  );
};

export default withRouter(Login);
