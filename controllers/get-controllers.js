const { fetchUsers } = require("../models/users-models");
const { fetchEvents } = require("../models/events-models")

function getAllUsers(req, res, next) {
  return fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
}

function getAllEvents(req, res, next) {
  return fetchEvents().then((events) => {
    res.status(200).send({ events });
  })
}

module.exports = {
  getAllUsers,
  getAllEvents
};
