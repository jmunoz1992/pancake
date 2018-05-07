const User = require("./user");
const Project = require("./project");
const Issue = require("./issue");
const Mockup = require("./mockup");
const MockupElement = require("./mockupelement");

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

Project.hasMany(Mockup);
Mockup.belongsTo(Project);

Mockup.hasMany(MockupElement);
MockupElement.belongsTo(Mockup);

module.exports = {
  User,
  Project,
  Issue,
  Mockup,
  MockupElement
};
