const db = require('../db/connection')

function fetchUsers() {
    return db
    .query('SELECT * FROM users;').then(({ rows })=> {
        return rows
    })
}

function insertUser(newUser) {
    return db.query(`INSERT INTO users
    (username, first_name, last_name, age, avatar_url, interests)
    VALUES
    ($1, $2, $3, $4, $5, $6) RETURNING *;`, 
    [newUser.username, newUser.first_name, newUser.last_name, newUser.age, newUser.avatar_url, newUser.interests]).then(({ rows }) => {
        return rows[0]
    })
}

module.exports = {
    fetchUsers,
    insertUser
}