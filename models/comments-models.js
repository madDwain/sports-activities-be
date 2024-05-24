const db = require("../db/connection");


function getCommentsData(event_id) {
    return db
      .query(
        `SELECT * FROM comments WHERE event_id = $1;`,
        [event_id]
      )
      .then((comments) => {
        if (comments.rows.length === 0) {
            return Promise.reject({status:404, msg:"event not found"})
        }
        return comments.rows;
      });
  }

function removeComments(comment_id) {
  return db.query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *;`, [comment_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "comment_id not found" });
    }
    return rows[0]
  })
}

module.exports = {getCommentsData, removeComments}