const router = require("express").Router();
module.exports = router;

router.get("/", async (req, res, next) => {
    try {
        const response = await req.octokit.repos.getCollaborators({
            owner: req.repoOwner,
            repo: req.repoName,
        });
        res.json(response.data);
    } catch (err) {
        next(err);
    }
});
