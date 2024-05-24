const db = require("../db/connection");
const comments = require("../db/data/test-data/comments");


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

  function postCommentData(comment, event_id) {
    const { username, body } = comment;
    const keysArray = Object.keys(comment);
    if (
      keysArray.length !== 2
    ) {
      return Promise.reject({
        status: 400,
        msg: "Bad request: incomplete body",
      });
    } else {
      return db
        .query(
          `INSERT INTO comments (username, body, event_id) VALUES ($1, $2, $3) RETURNING *`,
          [username, body, event_id]
        )
        .then((comment) => {
          return comment.rows[0];
        });
    }
  }

module.exports = {getCommentsData, postCommentData}