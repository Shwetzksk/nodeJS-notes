const express = require("express");
const router = express.Router();
const userData = require("./add-users");

router.get("/", (req, res, next) => {
  console.log("users", userData.data);
  res.render("users", {
    pageTitle: "Users",
    users: userData.data,
    path: "/users",
  });
});

module.exports = router;
