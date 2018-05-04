const router = require("express").Router();
const { Issue } = require("../db/models");
module.exports = router;

/**
 * return all issues for a project
 */
router.get("/", async (req, res, next) => {
    try {
        const issues = await req.octokit.issues.getForRepo({ owner: req.repoOwner, repo: req.repoName });
        res.json(issues);
    } catch (err) {
        next(err);
    }
});
