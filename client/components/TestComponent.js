import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { auth } from "../store";
import axios from "axios";

export const TestComponent = () => {
  return (
    <div>
      <button onClick={makeGist}>CLICK ME</button>
    </div>
  );
};

const makeGist = () => {
  axios.post("/api/test");
};
