const { insertUser } = require("../models/users-models");
const { insertEvent, fetchEvents } = require("../models/events-models");
const { postCategoryData } = require("../models/categories-models");
const { insertMember } = require("../models/members-models");
const { checkEventIDExists } = require("../db/seeds/utils");

function postUser(req, res, next) {
  return insertUser(req.body)
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((err) => {
      next(err);
    });
}

function postEvent(req, res, next) {
  return fetchEvents().then((events) => {
    const event_id = events.length + 1;
    return insertEvent(req.body, event_id)
      .then((newEvent) => {
        res.status(201).send(newEvent);
      })
      .catch((err) => {
        next(err);
      });
  });
}

function postCategory(req, res, next) {
  const { name, description } = req.body;

  postCategoryData(name, description)
    .then((newCategory) => {
      res.status(201).send(newCategory);
    })
    .catch(next);
}

function postMember(req, res, next) {
  const { username } = req.params;
  const { event_id } = req.params;
  return checkEventIDExists(event_id)
    .then(() => {
      return insertMember(username, event_id);
    })
    .then((member) => {
      res.status(201).send(member);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { postUser, postEvent, postCategory, postMember };
