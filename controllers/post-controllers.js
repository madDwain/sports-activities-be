const { insertUser } = require("../models/users-models");

function postUser(req, res, next) {
  return insertUser(req.body).then((newUser) => {
    res.status(201).send(newUser);
  }).catch((err) => {
    next(err)
  })
}

module.exports = { postUser };
