const db = require("../db/connection");
const fs = require("fs");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};

exports.fetchArticleById = (id) => {
  return db
    .query(
      `SELECT * FROM articles
  WHERE articles.article_id = $1;`,
      [id]
    )
    .then((result) => {
      if (result.rows.length !== 0) {
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "This id is not found",
        });
      }
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,
COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return result.rows;
    });
};

exports.fetchCommentsById = (id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id =$1 
      ORDER BY created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

//POST
exports.addComments = (id, author, body) => {
  if (!author || !body) {
    return Promise.reject({
      status: 400,
      msg: "bad request, missing information",
    });
  }

  return db
    .query(
      `INSERT INTO comments (article_id, author,body) VALUES ($1, $2, $3) RETURNING *;`,
      [id, author, body]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "id not found",
        });
      } else {
        return rows[0];
      }
    });
};

//PATCH
exports.updateVotes = (id, votes) => {
  if (!votes) {
    return Promise.reject({
      status: 400,
      msg: "no vote update detected",
    });
  } else {
    return db
      .query(
        `UPDATE articles SET votes=votes + $2 WHERE article_id =$1 RETURNING *`,
        [id, votes]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "This id is not found",
          });
        } else {
          return rows[0];
        }
      });
  }
};
