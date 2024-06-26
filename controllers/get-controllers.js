const { fetchUsers, getUserData } = require("../models/users-models");
const {
  fetchEvents,
  fetchEventByID,
  fetchEventsByUsername,
  fetchEventsByHost,
} = require("../models/events-models");
const {
  fetchMembersByEventID,
  fetchPendingRequests,
} = require("../models/members-models");
const { getCommentsData } = require("../models/comments-models");
const { fetchCategories } = require("../models/categories-models");
const { checkEventIDExists } = require("../db/seeds/utils");

function getEndpoints(req, res, next) {
  const endpoints = require("../endpoints.json");
  res.status(200).send({ endpoints });
}

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
      .then((value) => {})
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

function getUser(req, res, next) {
  const { username } = req.params;
  getUserData(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function getAllComments(req, res, next) {
  const { event_id } = req.params;
  getCommentsData(event_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
}

function getAllCategories(req, res, next) {
  return fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
}

function getUsernameEvents(req, res, next) {
  const { username } = req.params;
  const { is_accepted } = req.query;
  return fetchEventsByUsername(username, is_accepted)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch((err) => {
      next(err);
    });
}

function getEventsByHost(req, res, next) {
  const { username } = req.params;
  return fetchEventsByHost(username)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch((err) => {
      next(err);
    });
}

async function getPendingRequests(req, res, next) {
  const { username } = req.params;
  return await fetchEventsByHost(username)
    .then((events) => {
      return events.map((event) => {
        return event.event_id;
      });
    })
    .then((event_ids) => {
      return fetchPendingRequests(event_ids);
    })
    .then((body) => {
      res.status(200).send(body);
    })
    .catch((err) => {
      next(err)
    });
}

module.exports = {
  getAllUsers,
  getAllEvents,
  getEventByID,
  getEventMembers,
  getUser,
  getEndpoints,
  getAllComments,
  getAllCategories,
  getUsernameEvents,
  getEventsByHost,
  getPendingRequests,
};
