const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const router = express.Router();

const products = [];

router.get("/add-products", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-products.html"));
});

router.post("/add-products", (req, res, next) => {
  if (req.body.title) {
    products.push(req.body);
  }
  res.redirect("/");
});

module.exports.data = products;
module.exports.router = router;
