const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const router = express.Router();
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  res.render("shop", {
    products: adminData.data,
    pageTitle: "Products",
    path: "/",
    activeHome: true,
    activeProducts: false,
    // layout: false, //special key that renders layout (main-layout.hbs, set up in app.js)
  }); //it will use default templating engine that's why we declared app.set("view engine","pug")
});

module.exports = router;
