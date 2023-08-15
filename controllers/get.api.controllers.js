const { fetchAllTopics } = require("../models/get.api.models");

exports.getTopics = (request, response) => {
  fetchAllTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};
