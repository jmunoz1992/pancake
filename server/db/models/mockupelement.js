const Sequelize = require("sequelize");
const db = require("../db");

const MockupElement = db.define("mockupelement", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  data: {
    type: Sequelize.JSON
  }
});

module.exports = MockupElement;
