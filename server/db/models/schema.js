const Sequelize = require("sequelize");
const db = require("../db");

const Schema = db.define("schema", {
  properties: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

module.exports = Schema;
