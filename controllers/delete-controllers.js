const {deleteUserData} = require("../models/users-models");

function deleteUser(req, res, next) {
  const { username } = req.params;
  deleteUserData(username).then(() => {
    res.sendStatus(204);
  }).catch(next)
}

module.exports = { deleteUser };


