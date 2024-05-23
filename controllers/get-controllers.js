const { fetchUsers } = require("../models/users-models");
const { fetchEvents, fetchEventByID } = require("../models/events-models");
const { fetchMembersByEventID } = require("../models/members-models");
const { checkEventIDExists } = require("../db/seeds/utils");

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

function getEventMembers(req, res, next) {
  const { is_accepted } = req.query;
  const { event_id } = req.params;

  if (event_id) {
    checkEventIDExists(event_id)
      .then((value) => {
      })
      .catch((err) => {
        next(err);
      });
  }

  return fetchMembersByEventID(event_id, is_accepted)
    .then((members) => {
      res.status(200).send(members);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getAllUsers,
  getAllEvents,
  getEventByID,
  getEventMembers,
};
