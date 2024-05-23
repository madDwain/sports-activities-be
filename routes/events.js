const { getAllEvents, getEventByID, getEventMembers } = require("../controllers/get-controllers")
const { postEvent } = require('../controllers/post-controllers')
const express = require("express");
const router = express.Router();

router.get("", getAllEvents);
router.get("/:event_id", getEventByID)
router.post("", postEvent);
router.get("/:event_id/members", getEventMembers)

module.exports = router;
