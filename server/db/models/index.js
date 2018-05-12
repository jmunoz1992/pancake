const User = require("./user");
const Project = require("./project");
const Issue = require("./issue");
const Schema = require("./schema");
const Mockup = require("./mockup");
const MockupElement = require("./mockupelement");
const PullRequest = require("./pull-request");

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

Project.hasMany(PullRequest);
PullRequest.belongsTo(Project);

PullRequest.belongsToMany(Issue, {
  through: "pullRequests_issues"
});
Issue.belongsToMany(PullRequest, {
  through: "pullRequests_issues"
});

Schema.belongsTo(Project);
Project.hasMany(Schema);

Project.hasMany(Mockup);
Mockup.belongsTo(Project);

Mockup.hasMany(MockupElement);
MockupElement.belongsTo(Mockup);

module.exports = {
  User,
  Project,
  Issue,
  Schema,
  Mockup,
  MockupElement,
  PullRequest
};
