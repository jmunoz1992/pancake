const router = require("express").Router();
const octokit = require("@octokit/rest")();
const { User, Project } = require("../db/models");
module.exports = router;

router.post("/", async (req, res, next) => {
  try {
    req.user = await User.findById(1);
    const project = await Project.findOrCreate({
      where: { owner: req.body.owner, repository: req.body.repository }
    });
    const currentUser = await User.findById(req.user.id);
    // console.log("CURRENTUSER", currentUser);
    // console.log(Object.keys(currentUser.__proto__));
    // currentUser.activeProjectId = project.id;
    await currentUser.setActiveProject(project.id);
    console.log("set active project");
    // await currentUser.setActiveProject(project);
    // await currentUser.addProject(project.id);
    res.json(project);
  } catch (error) {
    next(error);
  }
});
