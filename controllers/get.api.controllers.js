const {
  fetchAllTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsById,
  addComments,
  updateVotes,
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
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsById = (req, response, next) => {
  const id = req.params.article_id;
  Promise.all([fetchArticleById(id), fetchCommentsById(id)])
    .then((resArray) => {
      const comments = resArray[1];
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

//POST
exports.postComments = (req, res, next) => {
  const { body, author } = req.body;
  const id = req.params.article_id;
  console.log("cont body");
  addComments(id, author, body)
    .then((comments) => {
      console.log("post cont 1");
      res.status(201).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

//PATCH

exports.patchById = (req, res, next) => {
  const id = req.params.article_id;
  const { inc_votes } = req.body;
  updateVotes(id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
