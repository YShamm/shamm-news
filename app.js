const express = require("express");
const app = express();
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getCommentsById,
  postComments,
  patchById,
} = require("./controllers/get.api.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComments);

app.patch("/api/articles/:article_id", patchById);

//error handling middleware
app.use((req, response, next) => {
  response.status(404).send({ msg: "not found" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  }
  next(err);
});

app.use((err, req, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "id not valid" }); //change this to id/vote invalid
    next(err);
  }
});

app.use((err, req, response, next) => {
  response.status(500).send({ msg: "internal error" });
});

module.exports = app;
