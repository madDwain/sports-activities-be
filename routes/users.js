const { getAllUsers } = require("../controllers/get-controllers");
const { postUser } = require("../controllers/post-controllers")
const {patchUser} = require("../controllers/patch-controllers")

const express = require("express")
const router = express.Router()

router.get("", getAllUsers);
router.post("", postUser);
router.patch("/:username", patchUser)

module.exports = router
