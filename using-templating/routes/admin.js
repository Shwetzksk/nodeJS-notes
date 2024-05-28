const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const router = express.Router();

router.get("/add-products", (req, res, next) => {
  console.log("add produts req", req.body);
  res.sendFile(path.join(rootDir, "views", "add-products.html"));
});

router.post("/add-products", (req, res, next) => {
  console.log("add-products req", req.body);
  res.redirect("/");
});

module.exports = router;
