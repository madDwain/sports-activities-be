const { getAllUsers } = require("../controllers/get-controllers");
const { postUser } = require("../controllers/post-controllers")
const express = require("express")
const router = express.Router()

router.get("", getAllUsers);
router.post("", postUser);

module.exports = router
