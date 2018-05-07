const router = require("express").Router();
const octokit = require("@octokit/rest")();
const {
  User,
  Project
} = require("../db/models");
module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    req.user = await User.findById(1);
    const project = await Project.findOrCreate({
      where: {
        owner: req.body.owner,
        repository: req.body.repository
      }
    });
    const currentUser = await User.findById(req.user.id);
    await currentUser.setActiveProject(project[0]);
    await currentUser.addProject(project[0]);
    res.json(project[0]);
  } catch (error) {
    next(error);
  }
});
