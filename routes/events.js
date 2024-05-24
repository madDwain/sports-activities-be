const { getAllEvents, getEventByID, getEventMembers } = require("../controllers/get-controllers")
const { postEvent, postMember } = require('../controllers/post-controllers')
const {deleteEventByID} = require("../controllers/delete-controllers")
const express = require("express");
const router = express.Router();

router.get("", getAllEvents);
router.get("/:event_id", getEventByID)
router.post("", postEvent);
router.post("/:event_id/members/:username", postMember)

router.delete("/:event_id", deleteEventByID)
router.get("/:event_id/members", getEventMembers)


module.exports = router;
