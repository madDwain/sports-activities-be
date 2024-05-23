const { getAllUsers } = require("../controllers/get-controllers");
const { postUser } = require("../controllers/post-controllers")
const {patchUser} = require("../controllers/patch-controllers")
const {deleteUser} = require("../controllers/delete-controllers")

const express = require("express")
const router = express.Router()

router.get("", getAllUsers);
router.post("", postUser);
router.patch("/:username", patchUser)
router.delete("/:username", deleteUser)

module.exports = router
