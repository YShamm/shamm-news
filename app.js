const express = require("express");
const app = express();
const { getTopics, getApi } = require("./controllers/get.api.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);

app.use((req, response) => {
  response.status(404).send({ msg: "not found" });
});

module.exports = app;
