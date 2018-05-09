const Sequelize = require("sequelize");
const db = require("../db");

const Mockup = db.define("mockup", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Mockup"
  }
});

module.exports = Mockup;
