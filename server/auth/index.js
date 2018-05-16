const router = require("express").Router();
const User = require("../db/models/user");
const { Project } = require("../db/models");
module.exports = router;

router.post("/login", (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (!user) {
        console.log("No such user found:", req.body.email);
        res.status(401).send("Wrong username and/or password");
      } else if (!user.correctPassword(req.body.password)) {
        console.log("Incorrect password for user:", req.body.email);
        res.status(401).send("Wrong username and/or password");
      } else {
        req.login(user, err => (err ? next(err) : res.json(user)));
      }
    })
    .catch(next);
});

router.post("/signup", (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.login(user, err => (err ? next(err) : res.json(user)));
    })
    .catch(err => {
      if (err.name === "SequelizeUniqueConstraintError") {
        res.status(401).send("User already exists");
      } else {
        next(err);
      }
    });
});

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

router.get("/me", async (req, res) => {
  try {
    const project = await Project.findById(req.user.activeProjectId);
    if (project) {
      const projectName = project.repository;
      req.user.dataValues.projectName = projectName;
    }
    return res.json(req.user);
  } catch (error) {
    console.log("error in auth/me ", error);
  }
});

router.use("/github", require("./github"));
