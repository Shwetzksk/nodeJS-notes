const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("shop"); //it will use default templating engine that's why we declared app.set("view engine","pug")
});

module.exports = router;
