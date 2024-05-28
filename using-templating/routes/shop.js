const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const router = express.Router();
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  console.log("Added data", adminData.data);
  res.render("shop", {
    products: adminData.data,
    pageTitle: "Products",
    path: "/",
  }); //it will use default templating engine that's why we declared app.set("view engine","pug")
});

module.exports = router;
