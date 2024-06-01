const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
const path = require("path");
const adminRouters = require("./routes/admin");
const shopRouters = require("./routes/shop");
const errorController = require("./controllers/error");

//setting up EJS template engine
app.set("view engine", "ejs"); //setup of EJS
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false })); //yields middleware with body parsing
app.use(express.static(path.join(__dirname, "public")));
app.use(shopRouters);
app.use("/admin", adminRouters);

// for 404 page
app.use(errorController.get404);

app.listen(port);
