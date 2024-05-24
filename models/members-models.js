const db = require("../db/connection");

function fetchMembersByEventID(event_id, is_accepted) {
    const validQueries = ['true', 'pending']
  let sqlQuery = "SELECT * FROM members WHERE event_id = $1";

  if (is_accepted && validQueries.includes(is_accepted)) {
    sqlQuery += ` AND is_accepted='${is_accepted}'`;
  }

  sqlQuery += ";";
  return db.query(sqlQuery, [event_id]).then(({ rows }) => {
    return rows;
  });
}

function insertMember(username, event_id) {
  return db.query(`INSERT INTO members (username, event_id, is_accepted)
  VALUES
  ($1, $2, 'pending') RETURNING *;`,
  [username, event_id]
  ).then(({ rows }) => {
    return rows[0]
  })
}

module.exports = { fetchMembersByEventID, insertMember };
