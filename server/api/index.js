const router = require("express").Router();
const octokit = require("@octokit/rest")();
module.exports = router;

// const authenticateGithub = (req, res, next) => {
//   if (!req.user) return res.sendStatus(403);

//   octokit.authenticate({
//     type: "oauth",
//     token: req.user.token
//   });
//   req.octokit = octokit;
// };
const authenticateGithub = (req, res, next) => {
  next();
};

router.use("/users", require("./users"));
router.use("/repos", require("./repos"));
router.use("/project", authenticateGithub, require("./project"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
