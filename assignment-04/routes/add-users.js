const express = require("express");
const router = express.Router();

const users = [];

router.get("/", (req, res, next) => {
  res.render("home", { pageTitle: "Users", path: "/" });
});
router.post("/", (req, res, next) => {
  if (req.body.fullname) {
    users.push(req.body.fullname);
  }
  res.redirect("/users");
});

module.exports.router = router;
module.exports.data = users;
