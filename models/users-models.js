const db = require("../db/connection");

function fetchUsers() {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
}

function insertUser(newUser) {
  return db
    .query(
      `INSERT INTO users
    (username, first_name, last_name, age, avatar_url, interests)
    VALUES
    ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        newUser.username,
        newUser.first_name,
        newUser.last_name,
        newUser.age,
        newUser.avatar_url,
        newUser.interests,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function patchUserData(
  username,
  first_name,
  last_name,
  age,
  avatar_url,
  interests
) {
    const validProperties = [first_name, last_name, age, avatar_url,interests]
    
    if (validProperties.every((element) => element === undefined))  {
        return Promise.reject({status: 400, msg: "Non-existent property"})
    }
  if (first_name) {
    return db
      .query(`UPDATE users SET first_name=$1 WHERE username = $2 RETURNING *`, [
        first_name,
        username,
      ])
      .then((user) => {
        if(user.rows.length===0) {
            return Promise.reject({status: 404, msg: "Username not found"})
        }
        return user.rows[0];
      });
  }
  if (last_name) {
    return db
      .query(`UPDATE users SET last_name=$1 WHERE username = $2 RETURNING *`, [
        last_name,
        username,
      ])
      .then((user) => {
        if(user.rows.length===0) {
            return Promise.reject({status: 404, msg: "Username not found"})
        }
        return user.rows[0];
      });
  }
  if (age) {
    return db
      .query(`UPDATE users SET age=$1 WHERE username = $2 RETURNING *`, [
        age,
        username,
      ])
      .then((user) => {
        if(user.rows.length===0) {
            return Promise.reject({status: 404, msg: "Username not found"})
        }
        return user.rows[0];
      });
  }
  if (avatar_url) {
    return db
      .query(`UPDATE users SET avatar_url=$1 WHERE username = $2 RETURNING *`, [
        avatar_url,
        username,
      ])
      .then((user) => {
          if(user.rows.length===0) {
              return Promise.reject({status: 404, message: "Username not found"})
          }
        return user.rows[0];
      });
  }
  if (interests) {
    return db
      .query(`UPDATE users SET interests=$1 WHERE username = $2 RETURNING *`, [
        interests,
        username,
      ])
      .then((user) => {
        if(user.rows.length===0) {
            return Promise.reject({status: 404, msg: "Username not found"})
        }
        return user.rows[0];
      });
  }
}

module.exports = {
  fetchUsers,
  insertUser,
  patchUserData,
};
