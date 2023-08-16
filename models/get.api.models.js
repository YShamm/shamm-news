const db = require("../db/connection");
const fs = require("fs");

exports.fetchAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};

// exports.fetchAllApis = () => {
//   return fs.readFile("./endpoints.json", "utf-8").then((contents) => {
//     return JSON.parse(contents);
//   });
// };

//delete above
