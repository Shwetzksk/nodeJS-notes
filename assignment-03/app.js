const express = require("express");
const path = require("path");
const app = express();
const homeRouter = require("./routes/home");
const userRouter = require("./routes/users");
const rootDir = require("./util/path");

app.use(express.static(path.join(__dirname, "public")));
app.use(userRouter);
app.use(homeRouter);

app.use((req, res, next) => {
  res.status(400).sendFile(path.join(rootDir, "view", "404.html"));
});
app.listen(3000);
