const User = require("./user");
const Project = require("./project");

User.belongsTo(Project, { as: "activeProject" });
User.belongsToMany(Project, { through: "users_projects" });
Project.belongsToMany(User, { through: "users_projects" });

module.exports = {
  User,
  Project
};
