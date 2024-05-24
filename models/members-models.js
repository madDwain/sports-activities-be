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

function patchMemberData(username, event_id, is_accepted) {
  return db.query(`UPDATE members SET is_accepted=$1 WHERE username=$2 AND event_id=$3 RETURNING *;`, [is_accepted, username, event_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg: 'username not found'})
    }
    return rows[0]
  })
}

module.exports = { fetchMembersByEventID, insertMember, patchMemberData };
