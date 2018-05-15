const router = require("express").Router();
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const { User } = require("../db/models");
const octokit = require("@octokit/rest")();

const githubCredentials = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK
};

function verificationCallback(token, refreshToken, profile, done) {
  // github may not provide an email, if so we'll just fake it
  const username = profile.username;

  const info = {
    username,
    token
  };

  User.findOrCreate({
    where: { githubId: profile.id },
    defaults: info
  })
    .spread(user => {
      done(null, user);
    })
    .catch(done);
}

passport.use(new GitHubStrategy(githubCredentials, verificationCallback));

router.get("/", passport.authenticate("github", { scope: ["repo", "admin:repo_hook", "gist"] }));

router.get("/verify", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
  res.redirect("/welcome");
});

router.get("/demo", async (req, res, next) => {
  const demoUser = await User.findById(1);
  demoUser.token = process.env.DEMO_USER_TOKEN;
  demoUser.save();
  req.login(demoUser, () => res.redirect("/welcome"));
});

module.exports = router;
