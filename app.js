const express = require("express");
const app = express();
const { getTopics } = require("./controllers/get.api.controllers");

app.get("/api/topics", getTopics);

app.use((req, res) => {
  res.status(404).send({ msg: "not found" });
});

module.exports = app;
