const User = require("./user");
const Project = require("./project");
const Issue = require("./issue");

User.belongsTo(Project, { as: "activeProject" });
User.belongsToMany(Project, { through: "users_projects" });
Project.belongsToMany(User, { through: "users_projects" });

Project.hasMany(Issue);
Issue.belongsTo(Project);

module.exports = {
  User,
  Project,
  Issue,
};
