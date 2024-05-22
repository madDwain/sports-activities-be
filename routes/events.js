const { getAllEvents } = require("../controllers/get-controllers")
const { postEvent } = require('../controllers/post-controllers')
const express = require("express");
const router = express.Router();

router.get("", getAllEvents);
router.post("", postEvent);

module.exports = router;
