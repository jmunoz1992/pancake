const Sequelize = require("sequelize");
const db = require("../db");

const Project = db.define("project", {
  owner: {
    type: Sequelize.STRING,
    allowNull: false
  },
  repository: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Project;
