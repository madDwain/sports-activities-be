const { getUsernameEvents } = require('../controllers/get-controllers')

const express = require("express");
const router = express.Router();

router.get("/:username", getUsernameEvents)

module.exports = router;