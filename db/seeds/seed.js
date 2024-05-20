const format = require("pg-format");
const db = require("../connection");

const seed = ({ userData }) => {
  return db
    .query(`DROP TABLE IF EXISTS users;`)
    .then(() => {
      const usersTablePromise = db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        age INT NOT NULL,
        avatar_url VARCHAR,
        interests VARCHAR NOT NULL
      );`);

      return Promise.all([usersTablePromise]);
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
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([usersPromise]);
    });
};

module.exports = seed;
