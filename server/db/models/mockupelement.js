const Sequelize = require("sequelize");
const db = require("../db");

const MockupElement = db.define("mockupelement", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  data: {
    type: Sequelize.TEXT
  }
});

module.exports = MockupElement;
