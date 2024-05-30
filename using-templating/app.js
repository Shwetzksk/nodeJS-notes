const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
const path = require("path");
const adminData = require("./routes/admin");
const shopRouters = require("./routes/shop");
const expressHbs = require("express-handlebars");

//setting up HANDLEBARS template engine

app.set("view engine", "ejs"); //setup of EJS

//initializing handlebars engine
// app.engine(
//   "hbs",
//   expressHbs({
//     layoutDir: "views/layouts/",
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// );
// app.set("view engine", "hbs");

//setting up PUG template engine
// app.set("view engine", "pug"); // set globally in our express server
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false })); //yields middleware with body parsing
app.use(express.static(path.join(__dirname, "public")));
app.use(shopRouters);
app.use("/admin", adminData.router);

// for 404 page
app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.render("404", { pageTitle: "Page not found" });
});

app.listen(port);
