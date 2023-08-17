const express = require("express");
const app = express();
const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
} = require("./controllers/get.api.controllers");

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);

//error handling middleware
app.use((req, response, next) => {
  //   console.log(err, "404 err");
  response.status(404).send({ msg: "not found" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err);
  }
  next(err);
});

// app.use((err, req, res, next) => {
//   if (err.status === 404 && err.msg) {
//     res.status(404).send(err);
//   }
//   next(err);
// });

// app.use((err, req, res, next) => {
//   if (err.status === 400 && err.msg) {
//     res.status(400).send(err);
//   }
//   next(err);
// });

app.use((err, req, response, next) => {
  //   console.log(err, "400 err");
  if (err.code === "22P02") {
    response.status(400).send({ msg: "id not valid" });
    next(err);
  }
});

// app.use((err, req, response, next) => {
//   // if (err.code === "22P02") {
//   console.log(err, "not found err");
//   response.status(404).send({ msg: "id not found" });
//   next(err);
//   // }
// });

app.use((err, req, response, next) => {
  //   console.log(err, "500 err");
  response.status(500).send({ msg: "internal error" });
});

module.exports = app;
