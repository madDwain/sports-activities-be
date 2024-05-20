const format = require("pg-format");
const db = require("../connection");

const seed = ({ userData }) => {
  return db
    .query(`DROP TABLE IF EXISTS users;`)
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
      const insertUsersQueryStr = format(
        "INSERT INTO users ( username, first_name, last_name, age, avatar_url, interests) VALUES %L;",
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

    });
};

module.exports = seed;
