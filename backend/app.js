const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const path = require("path");

const auth = require("./src/middleware/auth");

const userCtrl = require("./src/controllers/user");

const postsRoutes = require("./src/routes/posts");
const userRoutes = require("./src/routes/user");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/posts", postsRoutes);
app.use("/api/auth", userRoutes);

app.get("/api/users/:id", auth, userCtrl.getOneUser);
app.delete("/api/users/:id", auth, userCtrl.deleteAccount);

module.exports = app;
