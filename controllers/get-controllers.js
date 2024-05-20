const { fetchUsers } = require("../models/users-models");

function getAllUsers(req, res, next) {
  return fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
}

module.exports = {
  getAllUsers,
};
