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
      //console.log(result, "result");
      if (result.rows.length !== 0) {
        // console.log(result.rows.length, " res rows");
        return result.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "This id is not found",
        });
      }
    });
};

// exports.fetchAllArticles = () =>{
////topic, sort_by = "created_at", order = 'DESC') =>{
//   return db
//   .query(`SELECT articles.*,
// COUNT(comments.article_id) as comment_count
// FROM articles
////YAHYA: HOW CAN I ALSO : COUNT(comments.article_id) as comment_count
// GROUP BY articles.article_id
// ORDER BY articles.created_at DESC;`)
// }
// .then((result)=>{
//   if(rows.length === 0){
//     return Promise.reject({status:404, msg: 'not found'})
//   }
// })
