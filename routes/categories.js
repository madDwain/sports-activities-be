const express = require("express")
const { postCategory } = require("../controllers/post-controllers")
const { getAllCategories } = require('../controllers/get-controllers')

const router = express.Router()

router.get('', getAllCategories)
router.post("", postCategory)

module.exports = router