const User = require("./user");
const Project = require("./project");

// User.belongsToMany(Project, { through: "users_projects" });
// Project.belongsToMany(User, { through: "users_projects" });
User.belongsTo(Project, { as: "activeProject" });

module.exports = {
  User,
  Project
};
