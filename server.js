const express = require("express");
const mongoose = require("mongoose");
const article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const app = express();

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url = `mongodb+srv://test:sparta@cluster0.eaoas.mongodb.net/Cluster0?retryWrites=true&w=majority
`;

MongoClient.connect(url)
  .then((client) => {
    console.log("mongo connected");
    console.log(client);
  })
  .then(
    app.listen(4000, () => {
      console.log("4000 port on");
    })
  )
  .catch((err) => console.log(err));

mongoose.connect("mongodb://localhost/blog?authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await article.find().sort({
    createdAt: "desc",
  });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);

app.listen(3000);
