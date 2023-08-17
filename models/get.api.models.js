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
