const db = require("../db/connection");
const fs = require("fs");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};
