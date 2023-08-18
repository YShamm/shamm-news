const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsById,
  // updateVotes,
} = require("../models/get.api.models");
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

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  // console.log("in the controller");
  fetchAllArticles()
    // console
    //   .log("in cont 2")
    .then((articles) => {
      // console.log("in cont 3");
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsById = (req, response, next) => {
  console.log("in the controller");
  const id = req.params.article_id;
  Promise.all([fetchArticleById(id), fetchCommentsById(id)])
    .then((resArray) => {
      const comments = resArray[1];
      response.status(200).send({ comments });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
