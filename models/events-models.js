const db = require("../db/connection");
const {
  checkCategoryExists,
  checkUsernameExists,
} = require("../db/seeds/utils");

function fetchEvents(sortBy = "date", orderBy = "ASC", category, skill_level) {
  const validSorts = [
    "price",
    "capacity",
    "distance",
    "date",
    "category",
    "skill_level",
    "age_range"
  ];
  const validOrder = ["asc", "desc", "ASC", "DESC"];
  const validSkillLevels = ["all", "beginner", "intermediate", "expert"];
  if (!validSorts.includes(sortBy) || !validOrder.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "invalid request" });
  }

  let sqlQuery = `SELECT * FROM events `;

  if (category && skill_level) {
    sqlQuery += `WHERE category='${category}' AND skill_level='${skill_level}' `;
  }

  if (category && !skill_level) {
    sqlQuery += `WHERE category='${category}' `;
  }

  if (skill_level && !category) {
    sqlQuery += `WHERE skill_level='${skill_level}' `;
  }
  sqlQuery += `ORDER BY ${sortBy} ${orderBy};`;

  if (!validSkillLevels.includes(skill_level) && skill_level) {
    return Promise.reject({ status: 400, msg: "Invalid skill level" });
  }

  if (category) {
    return checkCategoryExists(category).then((value) => {
      return db
        .query(sqlQuery)
        .then(({ rows }) => {
          return rows;
        })
        .catch((err) => {
          next(err);
        });
    });
  }

  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
}

function insertEvent(event, event_id) {
  return db
    .query(
      `INSERT INTO events (event_name, event_id,
    host, location, date, category, age_range, price, capacity, skill_level)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
      [
        event.event_name,
        event_id,
        event.host,
        event.location,
        event.date,
        event.category,
        event.age_range,
        event.price,
        event.capacity,
        event.skill_level,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function fetchEventByID(event_id) {
  return db
    .query(`SELECT * FROM events WHERE event_id = $1;`, [event_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "event_id is not found" });
      }
      return rows[0];
    });
}

function deleteEventByIDData(event_id) {
  return db
    .query(`DELETE FROM members WHERE event_id=$1 RETURNING *`, [event_id])
    .then(() => {
      return db
        .query(`DELETE FROM comments WHERE event_id=$1 RETURNING*`, [event_id])
        .then(() => {
          return db
            .query(`DELETE FROM events WHERE event_id=$1 RETURNING *`, [
              event_id,
            ])
            .then((event) => {
              if (event.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Event not found" });
              }
            });
        });
    });
}

function fetchEventsByUsername(username, is_accepted) {
  const validSorts = ["true", "pending"];

  let sqlQuery = `SELECT event_id FROM members WHERE username = $1`;

  if (is_accepted && validSorts.includes(is_accepted)) {
    sqlQuery += ` AND is_accepted = '${is_accepted}'`;
  }

  sqlQuery += `;`;
  return checkUsernameExists(username).then(() => {
    return db.query(sqlQuery, [username]).then(({ rows }) => {
      const event_id_array = rows.map((object) => {
        return db
          .query(`SELECT * FROM events WHERE event_id = $1;`, [object.event_id])
          .then(({ rows }) => {
            return rows[0];
          });
      });
      return Promise.all(event_id_array).then((resolvedArray) => {
        return resolvedArray;
      });
    });
  });
}

function fetchEventsByHost(host) {
  return checkUsernameExists(host).then(() => {
    return db
      .query(`SELECT * FROM events WHERE host = $1;`, [host])
      .then(({ rows }) => {
        return rows;
      });
  });
}

module.exports = {
  fetchEvents,
  insertEvent,
  fetchEventByID,
  deleteEventByIDData,
  fetchEventsByUsername,
  fetchEventsByHost,
};
