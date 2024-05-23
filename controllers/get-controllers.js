const { fetchUsers } = require("../models/users-models");
const { fetchEvents } = require("../models/events-models");

function getAllUsers(req, res, next) {
  return fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
}

function getAllEvents(req, res, next) {
  const { sort_by } = req.query;
  const { order_by } = req.query;
  const { category } = req.query;
  return fetchEvents(sort_by, order_by, category)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getAllUsers,
  getAllEvents,
};
