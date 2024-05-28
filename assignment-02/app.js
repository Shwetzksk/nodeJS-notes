const express = require("express");
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log("Go through here!");
  next();
});
app.use("/users", (req, res, next) => {
  console.log("Users route!!");
  res.send("<html><body><h1>Users</h1></body></html>");
});
app.use("/", (req, res, next) => {
  console.log("Home route!!");
  res.send("<html><body><h1>Home</h1></body></html>");
});

app.listen(PORT);
