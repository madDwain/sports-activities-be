const {deleteUserData} = require("../models/users-models");
const {deleteEventByIDData} = require("../models/events-models")

function deleteUser(req, res, next) {
  const { username } = req.params;
  deleteUserData(username).then(() => {
    res.sendStatus(204);
  }).catch(next)
}

function deleteEventByID(req, res, next) {
  const { event_id } = req.params
  deleteEventByIDData(event_id).then(() => {
    res.sendStatus(204)
  }).catch(next)
}


module.exports = { deleteUser, deleteEventByID };


