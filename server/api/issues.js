const router = require("express").Router();
const { Issue } = require("../db/models");
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

/**
 * Add assignee to issue
 */
router.post("/:number/assignees", async (req, res, next) => {
  try {
    const newAssignees = req.body.map(user => user.login);
    const response = await req.octokit.issues.addAssigneesToIssue({
      owner: req.repoOwner,
      repo: req.repoName,
      number: Number(req.params.number),
      assignees: newAssignees
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Remove assigne from issue
 */
router.put("/:number/assignees", async (req, res, next) => {
  try {
    const response = await req.octokit.issues.removeAssigneesFromIssue({
      owner: req.repoOwner,
      repo: req.repoName,
      number: Number(req.params.number),
      assignees: req.body,
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});


/**
 * Get all labels from this repository
 */
router.get("/labels", async (req, res, next) => {
  try {
    const response = await req.octokit.issues.getLabels({
      owner: req.repoOwner,
      repo: req.repoName,
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Add label to this issue
 */
router.post("/:number/labels", async (req, res, next) => {
  try {
    const response = await req.octokit.issues.addLabels({
      owner: req.repoOwner,
      repo: req.repoName,
      number: req.params.number,
      labels: req.body,
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

router.delete("/:number/labels/:name", async (req, res, next) => {
  console.log("in delete");
  try {
    const response = await req.octokit.issues.removeLabel({
      owner: req.repoOwner,
      repo: req.repoName,
      number: req.params.number,
      name: req.params.name,
    });
    console.log("RESPONSE:", response);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});
