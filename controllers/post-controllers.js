const { insertUser } = require("../models/users-models");
const { insertEvent, fetchEvents } = require("../models/events-models");

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
    const event_id = (events.length+1)
    return insertEvent(req.body, event_id)
      .then((newEvent) => {
        res.status(201).send(newEvent);
      })
      .catch((err) => {
        next(err);
      });
  });
}

module.exports = { postUser, postEvent };
