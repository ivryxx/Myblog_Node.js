const express = require("express");
const mongoose = require("mongoose");
const article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");

const initializePassport = require("./passport-config");
initializePassport(passport);

const users = [];
// const jwt = require("jsonwebtoken");

// const token = jwt.sign({ test: true });

// console.log(token);

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("index.ejs", { name: "Kyle" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", (req, res) => {});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});

app.get("/", async (req, res) => {
  const articles = await article.find().sort({
    createdAt: "desc",
  });
  res.render("articles/list", { articles: articles });
});

app.use("/articles", articleRouter);

app.listen(3000);
