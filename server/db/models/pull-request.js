const Sequelize = require("sequelize");
const db = require("../db");

const PullRequest = db.define("pull-request", {
  number: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = PullRequest;
