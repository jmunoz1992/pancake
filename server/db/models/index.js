const User = require("./user");
const Project = require("./project");
const Issue = require("./issue");
const Schema = require("./schema");

User.belongsTo(Project, {
  as: "activeProject"
});
User.belongsToMany(Project, {
  through: "users_projects"
});
Project.belongsToMany(User, {
  through: "users_projects"
});

Project.hasMany(Issue);
Issue.belongsTo(Project);

Schema.belongsTo(Project);
Project.hasMany(Schema);

module.exports = {
  User,
  Project,
  Issue,
  Schema
};
