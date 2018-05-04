const router = require("express").Router();
const octokit = require("@octokit/rest")();
module.exports = router;

const { Project } = require("../db/models");

const authenticateGithub = async (req, res, next) => {
  if (!req.user) return res.sendStatus(403);

  octokit.authenticate({
    type: "oauth",
    token: req.user.token
  });

  req.octokit = octokit;
  next();
};

const setupProject = async (req, res, next) => {
  if (!req.user.activeProjectId) return res.status(403).send("No active project");
  const project = await Project.findById(req.user.activeProjectId);
  req.repoOwner = project.owner;
  req.repoName = project.repository;
  next();
};

router.use("/users", require("./users"));
router.use("/repos", require("./repos"));
router.use("/project", authenticateGithub, require("./project"));
router.use("/issues", authenticateGithub, setupProject, require("./issues"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
