// const db = require("../db/connection");


// function getCommentsData(event_id) {
//     return db
//       .query(
//         `SELECT * FROM comments WHERE event_id = $1;`,
//         [event_id]
//       )
//       .then((comments) => {
//         return comments.rows;
//       });
//   }

// module.exports = {getCommentsData}