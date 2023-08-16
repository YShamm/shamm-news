const { fetchAllTopics } = require("../models/get.api.models");
const endpoints = require("../endpoints.json");

exports.getTopics = (request, response, next) => {
  fetchAllTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch(next);
};

exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints });
};
