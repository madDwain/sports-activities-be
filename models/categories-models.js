const db = require("../db/connection");

function postCategoryData(name, description) {
    if (!name || ! description) {
        return Promise.reject({status: 400, msg: "Missing field"})
    }
    return db.query(`INSERT into categories (name, description) VALUES ($1, $2) RETURNING *`, [name, description]).then((category) => {
        return category.rows[0]
    })
}

module.exports = {postCategoryData}