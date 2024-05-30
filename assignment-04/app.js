const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;
const userRouter = require("./routes/users");
const addUsersData = require("./routes/add-users");
const path = require("path");

//set-up template engine
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false })); //important to add, if not added then unable to read posted data from form
app.use(express.static(path.join(__dirname, "public")));
app.use(addUsersData.router);
app.use("/users", userRouter);

app.use((req, res, next) => {
  res.render("404", { pageTitle: "Page not found", path: "" });
});
app.listen(PORT);
