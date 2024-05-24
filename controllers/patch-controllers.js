const { patchUserData } = require("../models/users-models");
const { patchMemberData } = require('../models/members-models')
const { checkEventIDExists } = require('../db/seeds/utils')

function patchUser(req, res, next) {
  const { username } = req.params;
  const { first_name } = req.body;
  const { last_name } = req.body;
  const { age } = req.body;
  const { avatar_url } = req.body;
  const { interests } = req.body;
  patchUserData(username, first_name, last_name, age, avatar_url, interests)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function patchMember(req, res, next) {
  const { username } = req.params;
  const { event_id } = req.params;
  const { is_accepted } = req.body;
  return checkEventIDExists(event_id)
    .then(() => {
      return patchMemberData(username, event_id, is_accepted)
    })
    .then((member) => {
      res.status(200).send(member);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { patchUser, patchMember };
