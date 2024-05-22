const db = require("../db/connection");

function fetchEvents(sortBy = "date", orderBy = "ASC", category) {
  const validSorts = ["price", "capacity", "distance", "date", "category"];
  const validOrder = ["asc", "desc", 'ASC', 'DESC'];

  if (!validSorts.includes(sortBy) || !validOrder.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "invalid request" });
  }
 
  return db
    .query(`SELECT * FROM events WHERE category=$1 ORDER BY ${sortBy} ${orderBy}`, [category])
    .then(({ rows }) => {
      console.log(rows)
      return rows;
    });
}

function insertEvent(event) {
  return db
    .query(
      `INSERT INTO events (event_name,
    host, location, date, category, age_range, price, capacity, skill_level)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [
        event.event_name,
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
