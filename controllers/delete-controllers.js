const { deleteUserData } = require("../models/users-models");
const { deleteEventByIDData } = require("../models/events-models");
const { removeMember } = require("../models/members-models");
const { removeComments } = require("../models/comments-models");
const { checkEventIDExists } = require("../db/seeds/utils");

function deleteUser(req, res, next) {
  const { username } = req.params;
  deleteUserData(username)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

function deleteEventByID(req, res, next) {
  const { event_id } = req.params;
  deleteEventByIDData(event_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

function deleteMember(req, res, next) {
  const { username } = req.params;
  const { event_id } = req.params;
  return removeMember(username, event_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  const { event_id } = req.params;
  return checkEventIDExists(event_id)
    .then(() => {
      return removeComments(comment_id).then((rows) => {
        res.sendStatus(204);
      });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { deleteUser, deleteEventByID, deleteMember, deleteComment };
