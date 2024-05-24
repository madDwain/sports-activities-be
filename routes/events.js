const { getAllEvents, getEventByID, getEventMembers, getAllComments } = require("../controllers/get-controllers")
const { postEvent, postMember } = require('../controllers/post-controllers')
const {deleteEventByID, deleteMember, deleteComment} = require("../controllers/delete-controllers")
const { patchMember } = require('../controllers/patch-controllers')

const express = require("express");
const router = express.Router();

router.get("", getAllEvents);
router.get("/:event_id", getEventByID)
router.post("", postEvent);
router.post("/:event_id/members/:username", postMember)
router.patch("/:event_id/members/:username", patchMember)
router.delete("/:event_id", deleteEventByID)
router.get("/:event_id/members", getEventMembers)
router.delete("/:event_id/members/:username", deleteMember)
router.get("/:event_id/comments", getAllComments)
router.delete("/:event_id/comments/:comment_id", deleteComment)


module.exports = router;
