const { fetchUsers } = require("../models/users-models");
const { fetchEvents, fetchEventByID } = require("../models/events-models");

function getAllUsers(req, res, next) {
  return fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
}

function getAllEvents(req, res, next) {
  const { sort_by } = req.query;
  const { order_by } = req.query;
  const { category } = req.query;
  const { skill_level } = req.query;

  return fetchEvents(sort_by, order_by, category, skill_level)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch((err) => {
      next(err);
    });
}

function getEventByID(req, res, next) {
  const { event_id } = req.params;
  return fetchEventByID(event_id)
    .then((event) => {
      res.status(200).send(event);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getAllUsers,
  getAllEvents,
  getEventByID,
};
