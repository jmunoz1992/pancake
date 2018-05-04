const router = require("express").Router();
const { Issue } = require("../db/models");
module.exports = router;

/**
 * return all issues for a project
 */
router.get("/", async (req, res, next) => {
  try {
    const response = await req.octokit.issues.getForRepo({ owner: req.repoOwner, repo: req.repoName });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});
