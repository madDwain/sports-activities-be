const express = require("express")
const { postCategory } = require("../controllers/post-controllers")

const router = express.Router()

router.post("", postCategory)

module.exports = router