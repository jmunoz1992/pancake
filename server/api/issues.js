const router = require("express").Router();
const {
  Issue
} = require("../db/models");
module.exports = router;

/**
 * return all issues for a project
 */
router.get("/", async (req, res, next) => {
  try {
    const response = await req.octokit.issues.getForRepo({
      owner: req.repoOwner,
      repo: req.repoName
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

/**
 * post new issue into database
 * need to use assignee method for issue
 */
router.post("/", async (req, res, next) => {
  try {
    // returns created issue object
    const response = await req.octokit.issues.create({
      owner: req.repoOwner,
      repo: req.repoName,
      title: req.body.title,
      body: req.body.body,
      assignees: req.body.assignees,
      labels: req.body.labels
    });
    const issue = await Issue.create({
      number: response.data.number,
      projectId: req.user.activeProjectId
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

/**
 * edits new issue into database
 * need to use assignee method for issue
 */
router.put("/:number", async (req, res, next) => {
  try {
    // returns created issue object
    const response = await req.octokit.issues.edit({
      owner: req.repoOwner,
      repo: req.repoName,
      number: req.params.number,
      title: req.body.title,
      body: req.body.body,
      assignees: req.body.assignees,
      labels: req.body.labels,
      state: req.body.state
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

router.post("/:number/assignees", async (req, res, next) => {
  try {
    const newAssignees = req.body.map(user => user.login);
    console.log("newAssignees", newAssignees);
    console.log("req.params.number", req.params.number);
    const response = await req.octokit.issues.addAssigneesToIssue({
      owner: req.repoOwner,
      repo: req.repoName,
      number: Number(req.params.number),
      assignees: newAssignees
    });
    console.log("response", response);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});
