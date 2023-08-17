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
