const router = require("express").Router();
const { PullRequest } = require("../db/models");
module.exports = router;

/**
 * return all issues for a project
 */
router.get("/", async (req, res, next) => {
  try {
    const response = await req.octokit.pullRequests.getAll({
      owner: req.repoOwner,
      repo: req.repoName
    });
    console.log("response in pull request  get ", response);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});
