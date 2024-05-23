const {patchUserData} = require("../models/users-models")


function patchUser(req, res, next) {
    const {username} = req.params
    const {first_name} = req.body
    const {last_name} = req.body
    const {age} = req.body
    const {avatar_url} = req.body
    const {interests} = req.body
    patchUserData(username, first_name, last_name, age, avatar_url, interests).then((user) => {
        res.status(200).send({user})
    }).catch(next)
}

module.exports = {patchUser}