const format = require("pg-format");
const db = require("../connection");
const {
  eventData,
  categoryData,
  membersData,
  commentsData,
} = require("../data/test-data");
const { formatEvents, createRef } = require("./utils");

const seed = ({ userData, eventData, membersData, commentsData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS members`).then(() => {
        return db.query(`DROP TABLE IF EXISTS events;`);
      });
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories`);
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
      CREATE TABLE categories (
        name VARCHAR PRIMARY KEY,
        description VARCHAR
      )`);
    })
    .then(() => {
      const insertIntoCategStr = format(
        "INSERT INTO categories (name, description) VALUES %L RETURNING *;",
        categoryData.map(({ name, description }) => [name, description])
      );
      return db.query(insertIntoCategStr);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE events (
        event_name VARCHAR NOT NULL,
        event_id INT PRIMARY KEY,
        host VARCHAR NOT NULL REFERENCES users(username),
        location VARCHAR NOT NULL,
        date TIMESTAMP DEFAULT NOW(),
        category VARCHAR NOT NULL REFERENCES categories(name),
        age_range VARCHAR NOT NULL,
        price INT NOT NULL,
        capacity INT NOT NULL DEFAULT 999,
        skill_level VARCHAR NOT NULL,
        description VARCHAR
      );`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE members (
        username VARCHAR REFERENCES users(username),
        event_id INT REFERENCES events(event_id),
        is_accepted VARCHAR NOT NULL 
      );
      `);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, body VARCHAR, username VARCHAR REFERENCES users(username), event_id INT REFERENCES events(event_id), date TIMESTAMP DEFAULT NOW());`
      );
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
        `INSERT INTO events (event_name, event_id, host, location, date, category, age_range, price, capacity, skill_level, description) VALUES %L;`,
        formattedEventData.map(
          ({
            event_name,
            event_id,
            host,
            location,
            date,
            category,
            age_range,
            price,
            capacity,
            skill_level,
            description,
          }) => [
            event_name,
            event_id,
            host,
            location,
            date,
            category,
            age_range,
            price,
            capacity,
            skill_level,
            description,
          ]
        )
      );
      return db.query(insertEventsQuery);
    })
    .then(() => {
      const insertMembersQueryStr = format(
        `INSERT INTO members (username, event_id, is_accepted) VALUES %L;`,
        membersData.map(({ username, event_id, is_accepted }) => [
          username,
          event_id,
          is_accepted,
        ])
      );

      return db.query(insertMembersQueryStr);
    })
    .then(() => {
      const insertCommentsQueryStr = format(
        `INSERT INTO comments (body, username, event_id, date) VALUES %L;`,
        commentsData.map(({ body, username, event_id, date }) => [
          body,
          username,
          event_id,
          date,
        ])
      );
      return db.query(insertCommentsQueryStr);
    });
};

module.exports = seed;
