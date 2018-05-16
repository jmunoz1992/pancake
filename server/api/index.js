const router = require("express").Router();
const octokit = require("@octokit/rest")();
module.exports = router;

const { Project, User } = require("../db/models");

const authenticateGithub = (req, res, next) => {
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
router.use("/pullRequests", authenticateGithub, setupProject, require("./pullRequests"));
router.use("/schemas", authenticateGithub, setupProject, require("./schemas"));
router.use("/collaborators", authenticateGithub, setupProject, require("./collaborators"));
router.use(async (error, req, res, next) => {
  if (req.user && req.user.token && (error.code === 403 || error.code === 401)) {
    console.log("The GitHub API returned an HTTP 403 error.");
    console.log("User is being logged out to refresh API token.");
    const user = await User.findById(req.user.id);
    user.token = "";
    await user.save();
    await req.logout();
    return res.sendStatus(403);
  }
  next(error);
});

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
