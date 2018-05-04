const Sequelize = require("sequelize");
const db = require("../db");

const Issue = db.define("issue", {
    number: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
});

module.exports = Issue;
