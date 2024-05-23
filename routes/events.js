const { getAllEvents, getEventByID } = require("../controllers/get-controllers")
const { postEvent } = require('../controllers/post-controllers')
const express = require("express");
const router = express.Router();

router.get("", getAllEvents);
router.get("/:event_id", getEventByID)
router.post("", postEvent);

module.exports = router;
