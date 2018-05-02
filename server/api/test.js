const router = require("express").Router();
const octokit = require("@octokit/rest")();
const { User } = require("../db/models");
module.exports = router;

router.post("/", async (req, res, next) => {
  // get token from database
  // pass token octokit.authenticate
  // make whatever api request
  console.log("req ", req);
  const files = {
    description: "the description for this gist",
    public: true,
    files: {
      "file1.txt": {
        content: "String file contents" + new Date()
      }
    }
  };

  if (req.user) {
    try {
      const userObj = await User.findById(req.user.id);
      const token = userObj.token;
      octokit.authenticate({
        type: "oauth",
        token
      });
      const result = await octokit.gists.create(files);
      res.json(result);
    } catch (error) {
      next(error);
    }
  } else {
    res.sendStatus(400);
  }
});
