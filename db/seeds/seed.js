const format = require("pg-format");
const db = require("../connection");
const { eventData } = require("../data/test-data");
const { formatEvents, createRef } = require("./utils");

const seed = ({ userData, eventData }) => {
  return db
    .query(`DROP TABLE IF EXISTS events;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        age INT NOT NULL,
        avatar_url VARCHAR,
        interests VARCHAR NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE events (
        event_name VARCHAR PRIMARY KEY,
        host VARCHAR NOT NULL REFERENCES users(username),
        location VARCHAR NOT NULL,
        date VARCHAR NOT NULL,
        category VARCHAR NOT NULL,
        age_range VARCHAR NOT NULL,
        price INT NOT NULL,
        capacity INT NOT NULL,
        skill_level VARCHAR NOT NULL
      );`);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users ( username, first_name, last_name, age, avatar_url, interests) VALUES %L RETURNING *;",
        userData.map(
          ({ username, first_name, last_name, age, avatar_url, interests }) => [
            username,
            first_name,
            last_name,
            age,
            avatar_url,
            interests,
          ]
        )
      );
      return db.query(insertUsersQueryStr);
    })
    .then(({ rows: userRows }) => {
      const usernameLookup = createRef(userRows, "username");
      const formattedEventData = formatEvents(eventData, usernameLookup);

      const insertEventsQuery = format(
        `INSERT INTO events (event_name, host, location, date, category, age_range, price, capacity, skill_level) VALUES %L;`,
        formattedEventData.map(
          ({
            event_name,
            host,
            location,
            date,
            category,
            age_range,
            price,
            capacity,
            skill_level,
          }) => [
            event_name,
            host,
            location,
            date,
            category,
            age_range,
            price,
            capacity,
            skill_level,
          ]
        )
      );
      return db.query(insertEventsQuery)
    });
};

module.exports = seed;
