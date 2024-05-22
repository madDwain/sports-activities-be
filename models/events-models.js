const db = require("../db/connection");
const { checkCategoryExists } = require("../db/seeds/utils");

function fetchEvents(sortBy = "date", orderBy = "ASC", category) {
  const validSorts = ["price", "capacity", "distance", "date", "category"];
  const validOrder = ["asc", "desc", "ASC", "DESC"];

  if (!validSorts.includes(sortBy) || !validOrder.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "invalid request" });
  }

  let sqlQuery = `SELECT * FROM events `;
  if (category) {
    sqlQuery += `WHERE category='${category}' `;
  }
  sqlQuery += `ORDER BY ${sortBy} ${orderBy};`;

  if (category) {
    return checkCategoryExists(category).then((value) => {
      if (!value) {
        return Promise.reject({ status: 404, msg: "Not found" });
      } else {
        return db.query(sqlQuery).then(({ rows }) => {
          return rows;
        });
      }
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

module.exports = { fetchEvents, insertEvent };
